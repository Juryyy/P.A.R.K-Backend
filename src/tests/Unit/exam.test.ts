import request from "supertest";
import envConfig from "../../configs/env-config";
import { TypeOfExamEnum, LevelEnum } from "@prisma/client";
import examSchemas from "../../helpers/Schemas/exam-schemas";

if (
  envConfig.getEnv("NODE_ENV") === "development" ||
  envConfig.getEnv("NODE_ENV") === "test"
) {
  describe("Exam schemas validation", () => {
    test("validates a valid exam info", () => {
      const validExamInfo = {
        venue: "Test Venue",
        type: TypeOfExamEnum.Paper,
        location: "Test Location",
        levels: [LevelEnum.A1],
        startTime: "10:00",
        endTime: "12:00",
        dayOfExamsId: 1,
      };

      expect(() =>
        examSchemas.examInfoSchema.parse(validExamInfo)
      ).not.toThrow();
    });

    test("throws an error for an invalid exam info", () => {
      const invalidExamInfo = {
        venue: "",
        type: "INVALID_TYPE",
        location: "",
        levels: ["INVALID_LEVEL"],
        startTime: "",
        endTime: "",
        dayOfExamsId: "invalid id",
      };

      expect(() => examSchemas.examInfoSchema.parse(invalidExamInfo)).toThrow();
    });

    test("validates a valid exam day report", () => {
      const validExamDayReport = {
        examId: 1,
        comment: "Test Comment",
        issues: "Test Issues",
      };

      expect(() =>
        examSchemas.examDayReportSchema.parse(validExamDayReport)
      ).not.toThrow();
    });

    test("throws an error for an invalid exam day report", () => {
      const invalidExamDayReport = {
        examId: "invalid id",
        comment: "",
        issues: "",
      };

      expect(() =>
        examSchemas.examDayReportSchema.parse(invalidExamDayReport)
      ).toThrow();
    });
  });
}
