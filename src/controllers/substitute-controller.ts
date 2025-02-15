import { URequest } from "../types/URequest";
import { Response } from 'express';
import logger from "../configs/logger";
import examService from "../services/exam-service";
import userService from "../services/user-service";
import substituteService from "../services/substitute-service";
import { ApplicationStatusEnum, RoleEnum } from "@prisma/client";
import { Request } from "express";
import { SubstitutionStatusEnum } from "@prisma/client";

export default {
    createSubstitution: async (req: URequest, res: Response) => {
        const currentUserId = req.user?.id;
        const { date, examId, reason, role, userId} = req.body;

        if (!currentUserId) {
            return res.status(401).json({ error: "Please login" });
        }

        if (!Object.values(RoleEnum).includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        try{
            const parsedDate = new Date(date);

            const exam = await examService.getExamById(examId);
            const user = await userService.getUserById(userId);

            if (!exam || !user || !parsedDate || !reason) {
                return res.status(400).json({ error: "Invalid data" });
            }

            if(currentUserId !== userId && req.user?.role.includes(RoleEnum.Office)) {
                const substitution = await substituteService.createSubstitution(userId, parsedDate, examId, reason, role);
                return res.status(201).json(substitution);
            }
        
            const substitution = await substituteService.createSubstitution(currentUserId, parsedDate, examId, reason, role);
            return res.status(201).json(substitution);

        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: "There has been an issue on server side, please try again" });
        }
    },

    getSubstitutions: async (req: URequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Please login" });
        }
        const substitutions = await substituteService.getSubstitutionsForUser(userId);
        return res.status(200).json(substitutions);
    },

    applyForSubstitution: async (req: URequest, res: Response) => {
        const currentUserId = req.user?.id;
        const { substitutionId } = req.params;

        if (!currentUserId) {
            return res.status(401).json({ error: "Please login" });
        }

        try {
            
            const substitution = await substituteService.getSubstitutionById(parseInt(substitutionId));

            if (!substitution) {
                return res.status(400).json({ error: "Invalid substitution" });
            }

            if (substitution.requestedBy.id === currentUserId) {
                return res.status(403).json({ error: "You are not allowed to apply for this substitution" });
            }

            if (substitution.status === SubstitutionStatusEnum.Closed) {
                return res.status(400).json({ error: "This substitution is not pending" });
            }
            try{
                await substituteService.applyForSubstitution(parseInt(substitutionId), currentUserId);
            } catch (error) {
                return res.status(400).json({ error: "You have already applied for this substitution" });
            }
            return res.status(200).json({ message: "Applied for substitution" });

        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: "There has been an issue on server side, please try again" });
        }
    },

    updateApplicationStatus: async (req: URequest, res: Response) => {
        const currentUserId = req.user?.id;
        const { applicationId, status } = req.body;

        if (!currentUserId) {
            return res.status(401).json({ error: "Please login" });
        }

        if (!Object.values(ApplicationStatusEnum).includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        try {
            const substitution = await substituteService.getSubstitutionById(parseInt(applicationId));

            if (!substitution) {
                return res.status(400).json({ error: "Invalid substitution" });
            }

            if (substitution.status !== SubstitutionStatusEnum.Open) {
                return res.status(400).json({ error: "This substitution is not pending" });
            }

            const application = await substituteService.updateApplicationStatus(parseInt(applicationId), status);
            if(status === ApplicationStatusEnum.Accepted) {
                await substituteService.updateSubstitutionStatus(application.substitutionId, SubstitutionStatusEnum.Closed);
                switch(substitution.originalRole) {
                    case RoleEnum.Supervisor:
                        await examService.addSupervisor(substitution.examId, application.applicantId);
                        break;
                    case RoleEnum.Invigilator:
                        await examService.addInvigilator(substitution.examId, application.applicantId);
                        break;
                    case RoleEnum.Examiner:
                        await examService.addExaminer(substitution.examId, application.applicantId);
                        break;
                    default:
                        return res.status(400).json({ error: "Invalid role" });
                }
            }
            return res.status(200).json({ message: "Substitution status updated" });

        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: "There has been an issue on server side, please try again" });
        }

    },

    getSubsForExam: async (req: Request, res: Response) => {
        const { examId } = req.params;

        try {
            const substitutions = await substituteService.getSubsForExam(parseInt(examId));
            return res.status(200).json(substitutions);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: "There has been an issue on server side, please try again" });
        }
    },

    getMyApplications: async (req: URequest, res: Response) => {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            return res.status(401).json({ error: "Please login" });
        }

        try {
            const applications = await substituteService.getApplicationsByUserId(currentUserId);
            return res.status(200).json(applications);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: "There has been an issue on server side, please try again" });
        }
    },

    deleteSubstitution: async (req: URequest, res: Response) => {
        const currentUserId = req.user?.id;
        const { substitutionId } = req.params;

        if (!currentUserId) {
            return res.status(401).json({ error: "Please login" });
        }

        try {
            const substitution = await substituteService.getSubstitutionById(parseInt(substitutionId));

            if (!substitution) {
                return res.status(400).json({ error: "Invalid substitution" });
            }

            if (substitution.requestedBy.id !== currentUserId || !req.user?.role.includes(RoleEnum.Office)) {
                return res.status(403).json({ error: "You are not allowed to delete this substitution" });
            }

            if (substitution.status !== SubstitutionStatusEnum.Open) {
                return res.status(400).json({ error: "This substitution is not pending" });
            }

            await substituteService.deleteSubstitution(parseInt(substitutionId));
            return res.status(200).json({ message: "Substitution deleted" });

        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: "There has been an issue on server side, please try again" });
        }
    },

    withdrawApplication: async (req: URequest, res: Response) => {
        const currentUserId = req.user?.id;
        const { id } = req.params;

        if (!currentUserId) {
            return res.status(401).json({ error: "Please login" });
        }

        try {
            const application = await substituteService.getApplicationById(parseInt(id));

            if (!application) {
                return res.status(400).json({ error: "Invalid application" });
            }

            if (application.applicantId !== currentUserId) {
                return res.status(403).json({ error: "You are not allowed to withdraw this application" });
            }

            if (application.status !== ApplicationStatusEnum.Pending) {
                return res.status(400).json({ error: "This application is not pending" });
            }

            await substituteService.withdrawApplication(parseInt(id));
            return res.status(200).json({ message: "Application withdrawn" });

        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: "There has been an issue on server side, please try again" });
        }
    },

    getCountOfOpenSubstitutions: async (req: URequest, res: Response) => {
        const currentUserId = req.user?.id;
        try {
            if (!currentUserId) {
                return res.status(401).json({ error: "Please login" });
            }
            const count = await substituteService.getOpenSubstitutionsCount(currentUserId);
            return res.status(200).json(count);
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ error: "There has been an issue on server side, please try again" });
        }
    }


}