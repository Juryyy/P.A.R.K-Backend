import { PrismaClient } from '@prisma/client';
import authService from '../src/services/auth-service';
import envConfig from '../src/configs/env-config';

const prisma = new PrismaClient();

async function main() {
    if (envConfig.getEnv('NODE_ENV') !== 'test') {
        console.error('NODE_ENV is not set to "test"! Aborting the seed!');
        return;
    }

    try {
        const TestUser = await prisma.user.create({
            data: {
                firstName: 'Martin',
                lastName: 'Šulc',
                email: 'martin.sulc2551@gmail.com',
                password: authService.hashPassword('test'),
                role: 'Office',
                activatedAccount: true,
                deactivated: false,
                phone: '123456789',
                dateOfBirth: new Date('2001-03-30'),
            },
        });

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error('Error running the seed:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });