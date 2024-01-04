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
            `;
        fs.writeFileSync(envPath, template);
        console.log('.env file created with template');
    } else {
        console.log('.env file already exists');
    }
}

