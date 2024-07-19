import { PrismaClient } from '@prisma/client';
import envConfig from '../src/configs/env-config';

const prisma = new PrismaClient();

async function main() {
    if (envConfig.getEnv('NODE_ENV') === 'test') {
        await prisma.$executeRaw`DROP SCHEMA IF EXISTS public CASCADE`;
        await prisma.$executeRaw`CREATE SCHEMA public`;
    } else {
        console.error('NODE_ENV is not set to "test". Aborting database reset.');
    }
}

main()
    .catch((error) => {
        console.error('Error running the reset:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });