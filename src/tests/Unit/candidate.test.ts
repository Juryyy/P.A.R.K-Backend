import request from "supertest";
import envConfig from "../../configs/env-config";
import { ImportedCandidate, Candidate, LevelEnum } from "@prisma/client";
import {importedCandidateSchema} from "../../helpers/Schemas/candidate-schemas";

if (
  envConfig.getEnv("NODE_ENV") === "development" ||
  envConfig.getEnv("NODE_ENV") === "test"
) {
    describe("Imported candidate schema validation", () => {
        const validImportedCandidate = {
            level: LevelEnum.A1,
            dateOfExam: new Date(),
            location: "Test Location",
            firstName: "Test",
            lastName: "Candidate",
            birthDate: new Date(),
            email: "test.candidate@example.com",
            phone: "1234567890",
            mock: true,
            paid: true,
            orderId: 1,
            crfToSchool: true
        };

        test("validates a valid imported candidate", () => {

            expect(() => importedCandidateSchema.parse(validImportedCandidate)).not.toThrow();
        });
    
        test("throws an error for an invalid imported candidate", () => {
            const invalidImportedCandidate = {
                level: "",
                dateOfExam: "invalid date",
                location: "",
                firstName: "",
                lastName: "",
                birthDate: "invalid date",
                email: "invalid email",
                phone: "",
                mock: "not a boolean",
                paid: "not a boolean",
                orderId: "invalid id",
                crfToSchool: "not a boolean"
            };
    
            expect(() => importedCandidateSchema.parse(invalidImportedCandidate)).toThrow();
        });

        test("throws an error when level is valid but dateOfExam is invalid", () => {
            const candidateWithInvalidDate = {
                ...validImportedCandidate,
                dateOfExam: "invalid date",
            };
    
            expect(() => importedCandidateSchema.parse(candidateWithInvalidDate)).toThrow();
        });
    
        test("throws an error when level is invalid but dateOfExam is valid", () => {
            const candidateWithInvalidLevel = {
                ...validImportedCandidate,
                level: "INVALID_LEVEL",
            };
    
            expect(() => importedCandidateSchema.parse(candidateWithInvalidLevel)).toThrow();
        });
    });
}