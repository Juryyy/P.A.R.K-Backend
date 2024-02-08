import * as pdfmake from 'pdfmake/build/pdfmake';
import * as vfsFonts from 'pdfmake/build/vfs_fonts';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../configs/logger';

(pdfmake as any).vfs = vfsFonts.pdfMake.vfs;
const robotoMedium = fs.readFileSync(path.join(__dirname, '../../fonts/Roboto-Medium.ttf')).toString('base64');

// Define the structure of your PDF document
export function createDayReportPdf(date: string, venue: string, type : string, examlevels: string[], supervisors: string[], invigilators: string[], examiners: string[], comment: string, issues: string) {
    let docDefinition = {
        content: [
            { text: 'Exam day report', style: 'header' },
            { text: ' '},
            { table: {
                widths: ['auto', '*'],
                body: [
                    [{ text: 'Date:', bold: true }, date],
                    [{ text: 'Venue:', bold: true }, venue],
                    [{ text: 'Type:', bold: true }, type],
                    [{ text: 'Levels:', bold: true }, examlevels.join(', ')],
                    [{ text: 'Supervisors:', bold: true }, supervisors.join(', ')],
                    [{ text: 'Invigilators:', bold: true }, invigilators.join(', ')],
                    [{ text: 'Examiners:', bold: true }, examiners.join(', ')],
                    [{ text: 'Comment:', bold: true }, comment],
                    [{ text: 'Issues:', bold: true }, issues]
                ]
            } },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
            },
        },
        defaultStyle: {
            font: 'Roboto'
        }
    };

    let fonts = {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        }
    };
    let vfs = {
        ...vfsFonts.pdfMake.vfs,
        'Roboto-Medium.ttf': robotoMedium
    };

    const filename = `${date} - ${venue} - ${type}.pdf`;

    let pdfDoc = pdfmake.createPdf(docDefinition, undefined, fonts, vfs);


    const filePath = path.resolve(__dirname, '../../static/pdf', filename);

    // Write the PDF document to a file
    try {
    pdfDoc.getBuffer((buffer: Buffer) => {
        try {
            console.log(filePath)
            fs.writeFile(filePath, buffer, (error: NodeJS.ErrnoException | null) => {
                if (error) {
                  logger.error('Error occurred while writing PDF to file: %s', error.message);
                  logger.error(`Error code: %s`, [error.code]);
                  console.error(error.code, error.message);
                }
        });
    } catch (error) {
        logger.error('Error occurred while getting PDF buffer: %s', error);
    }
});
    } catch (error) {
        logger.error('Error occurred while creating PDF: %s', error);
    }
}