import { PrismaClient, User, Exam, SubstitutionRequest, SubstitutionStatusEnum, RoleEnum, ApplicationStatusEnum} from "@prisma/client";

const prisma = new PrismaClient();

export default {
    async createSubstitution(userId: number, date: Date, examId: number, reason: string, role: RoleEnum) {
        return await prisma.substitutionRequest.create({
            data: {
                requestedAt: date,
                reason,
                originalRole: role,
                exam: {
                    connect: {
                        id: examId,
                    },
                },
                requestedBy: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    },

    async getSubstitutions() {
        return await prisma.substitutionRequest.findMany({
            include: {
                exam: true,
                requestedBy: true,
                _count: {
                    select: {
                        applications: true,
                    },
                },
            },
        });
    },

    async getSubstitutionById(substitutionId: number) {
        return await prisma.substitutionRequest.findUnique({
            where: {
                id: substitutionId,
            },
            include: {
                exam: true,
                requestedBy: true,
                _count: {
                    select: {
                        applications: true,
                    },
                },
            },
        });
    },

    async applyForSubstitution(substitutionId: number, userId: number) {
        return await prisma.substitutionApplication.create({
            data: {
            substitutionRequest: {
                connect: {
                id: substitutionId,
                },
            },
            applicant: {
                connect: {
                id: userId,
                },
            },
            appliedAt: new Date(),
            status: 'Pending',
            },
        });
    },

    async updateApplicationStatus(applicationId: number, status: ApplicationStatusEnum) {
        return await prisma.substitutionApplication.update({
            where: {
                id: applicationId,
            },
            data: {
                status,
            },
        });
    },

    async getApplicationsByUserId(userId: number) {
        return await prisma.substitutionApplication.findMany({
            where: {
                applicantId: userId,
            },
            include: {
                substitutionRequest: true,
            },
        });
    },

    async updateSubstitutionStatus(substitutionId: number, status: SubstitutionStatusEnum) {
        return await prisma.substitutionRequest.update({
            where: {
                id: substitutionId,
            },
            data: {
                status,
            },
        });
    },
    
    async getSubsForExam(examId: number) {
        return await prisma.substitutionRequest.findMany({
            where: {
                examId,
            },
            select: {
                examId: true,
                requestedById: true,
                status: true,
                originalRole: true,
            }
        });
    },

    async deleteSubstitution(substitutionId: number) {
        await prisma.substitutionApplication.deleteMany({
            where: {
                substitutionRequest: {
                    id: substitutionId,
                },
            },
        });

        return await prisma.substitutionRequest.delete({
            where: {
                id: substitutionId,
            },
        });
    },

    async withdrawApplication(applicationId: number) {
        return await prisma.substitutionApplication.delete({
            where: {
                id: applicationId,
            },
        });
    },

    async getApplicationById(applicationId: number) {
        return await prisma.substitutionApplication.findUnique({
            where: {
                id: applicationId,
            },
            include: {
                applicant: true,
                substitutionRequest: true,
            },
        });
    },

    async getOpenSubstitutionsCount(userId: number) {
        return await prisma.substitutionRequest.count({
            where: {
                requestedById: { not: userId },
                status: SubstitutionStatusEnum.Open,
                applications: {
                    none: {
                        applicantId: userId,
                    },
                },
            },
        });
    },

    async getSubstitutionsForUser(userId: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    
        if (!user) {
            throw new Error('User not found');
        }
    
        const substitutions = await prisma.substitutionRequest.findMany({
            where: {
                OR: [
                    {
                        requestedById: userId,
                    },
                    {
                        exam: {
                            adminCentre: {
                                in: user.adminCentre, 
                            },
                        },
                    },
                ],
            },
            include: {
                exam: true,
                requestedBy: true,
                _count: {
                    select: {
                        applications: true,
                    },
                },
            },
        });
    
        return substitutions;
    },
};
