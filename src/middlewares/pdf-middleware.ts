import * as pdfmake from 'pdfmake/build/pdfmake';
import * as vfsFonts from 'pdfmake/build/vfs_fonts';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../configs/logger';

(pdfmake as any).vfs = vfsFonts.pdfMake.vfs;

// Read fonts
const robotoMedium = fs.readFileSync(path.join(__dirname, '../../fonts/Roboto-Medium.ttf')).toString('base64');
const robotoRegular = fs.readFileSync(path.join(__dirname, '../../fonts/Roboto-Regular.ttf')).toString('base64');
const robotoItalic = fs.readFileSync(path.join(__dirname, '../../fonts/Roboto-Italic.ttf')).toString('base64');
const robotoMediumItalic = fs.readFileSync(path.join(__dirname, '../../fonts/Roboto-MediumItalic.ttf')).toString('base64');

// Define the structure of your PDF document
export function createDayReportPdf(date: string, venue: string, type: string, examlevels: string[], candidates: number, absent: number, supervisors: string[], invigilators: string[], examiners: string[], comment: string, issues: string, filename: string): Promise<string> {
    const docDefinition = {
        content: [
            { text: 'Exam day report', style: 'header' },
            { text: ' ' },
            {
                table: {
                    widths: ['auto', '*'],
                    body: [
                        [{ text: 'Date:', style: 'tableHeader' }, { text: date, style: 'tableCell' }],
                        [{ text: 'Venue:', style: 'tableHeader' }, { text: venue, style: 'tableCell' }],
                        [{ text: 'Type:', style: 'tableHeader' }, { text: type, style: 'tableCell' }],
                        [{ text: 'Levels:', style: 'tableHeader' }, { text: examlevels.join(', '), style: 'tableCell' }],
                        [{ text: 'Candidates:', style: 'tableHeader' }, { text: candidates.toString(), style: 'tableCell' }],
                        [{ text: 'Absent:', style: 'tableHeader' }, { text: absent.toString(), style: 'tableCell' }],
                        //absent id, name, level
                        //ticks for special considerations
                        [{ text: 'Supervisors:', style: 'tableHeader' }, { text: supervisors.join(', '), style: 'tableCell' }],
                        [{ text: 'Invigilators:', style: 'tableHeader' }, { text: invigilators.join(', '), style: 'tableCell' }],
                        [{ text: 'Examiners:', style: 'tableHeader' }, { text: examiners.join(', '), style: 'tableCell' }],
                        [{ text: 'Comment:', style: 'tableHeader' }, { text: comment, style: 'tableCell' }],
                        [{ text: 'Issues:', style: 'tableHeader' }, { text: issues, style: 'tableCell' }]
                    ]
                },
                layout: {
                    fillColor: function (rowIndex: number) {
                        return (rowIndex % 2 === 0) ? '#f2f2f2' : null;
                    }
                }
            }
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                margin: [0, 0, 0, 20] as [number, number, number, number]
            },
            tableHeader: {
                bold: true,
                fontSize: 14,
                color: 'black',
                fillColor: '#dddddd',
                margin: [0, 5, 0, 5] as [number, number, number, number]
            },
            tableCell: {
                margin: [0, 5, 0, 5] as [number, number, number, number],
                fontSize: 12
            }
        },
        defaultStyle: {
            font: 'Roboto'
        }
    };

    const fonts = {
        Roboto: {
            normal: 'Roboto-Regular.ttf',
            bold: 'Roboto-Medium.ttf',
            italics: 'Roboto-Italic.ttf',
            bolditalics: 'Roboto-MediumItalic.ttf'
        }
    };

    const vfs = {
        ...vfsFonts.pdfMake.vfs,
        'Roboto-Regular.ttf': robotoRegular,
        'Roboto-Medium.ttf': robotoMedium,
        'Roboto-Italic.ttf': robotoItalic,
        'Roboto-MediumItalic.ttf': robotoMediumItalic
    };

    const pdfDoc = pdfmake.createPdf(docDefinition, undefined, fonts, vfs);
    const filePath = path.join(__dirname, '../../static/pdf', filename);

    return new Promise<string>((resolve, reject) => {
        pdfDoc.getBuffer((buffer: Buffer) => {
            fs.writeFile(filePath, buffer, (error: NodeJS.ErrnoException | null) => {
                if (error) {
                    logger.error('Error occurred while writing PDF to file: %s', error.message);
                    reject(error);
                } else {
                    resolve(filePath);
                }
            });
        });
    });
}
