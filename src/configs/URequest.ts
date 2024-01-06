import { Request } from 'express';
import { User } from '@prisma/client';

interface MulterFile {
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
}

export type URequest = Request & { user?: User }; // Request with user property
export type MURequest = URequest & { file?: MulterFile }; // URequest with file property