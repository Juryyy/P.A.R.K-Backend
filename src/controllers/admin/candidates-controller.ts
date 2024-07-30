import candidateService from "../../services/candidate-service";
import { URequest } from "../../types/URequest";
import { importedCandidateSchema } from "../../helpers/Schemas/candidate-schemas"
import logger from "../../configs/logger";
import { Response } from 'express';
import { parseLevelEnum, parseTypeOfExamEnum} from "../../middlewares/admin/candidate-middleware";

export default{
    async createCandidates(req: URequest, res: Response){
        const importedCandidates = req.body;
    
        try {
            for (const importedCandidate of importedCandidates) {
                const { id, ...candidateData } = importedCandidate;
    
                try {
                    importedCandidateSchema.parse(candidateData);

                    candidateData.level = parseLevelEnum(candidateData.level);
                    candidateData.typeOfExam = parseTypeOfExamEnum(candidateData.typeOfExam);
    
                    const candidate = await candidateService.createImportedCandidate(candidateData);
                    if (!candidate) {
                        logger.error(`Error creating candidate: ${candidateData}`);
                    }else{
                        logger.info(`New candidate created: ${candidate?.orderId}`);
                    }
                } catch (error: unknown) {
                    logger.error(`Error parsing imported candidate: ${error}`);
                    return res.status(400).json({ error: 'Invalid data' });
                }
            }
    
            return res.status(201).json({ success: 'Candidates imported' });
        } catch (error) {
            logger.error(`Error processing imported candidates: ${error}`);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

