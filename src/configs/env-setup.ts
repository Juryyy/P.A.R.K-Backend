import fs from 'fs';
import path from 'path';

export function checkAndCreateEnv() {
    const envPath = path.join(__dirname, '.env');

    if (!fs.existsSync(envPath)) {
        const template = `
            POSTGRES_USER=
            POSTGRES_PASSWORD=
            DATABASE_URL=
            JWT_SECRET=
            JWT_SALT=
            NODE_ENV=development
            A_EXP = 1h
            A_EXP_REFRESH = 7d
            `;
        fs.writeFileSync(envPath, template);
        console.log('.env file created with template');
    } else {
        console.log('.env file already exists');
    }
}

