import request from "supertest";
import ResponseSchema from "../../helpers/Schemas/response-schemas";
import envConfig from "../../configs/env-config";

if (
  envConfig.getEnv("NODE_ENV") === "development" ||
  envConfig.getEnv("NODE_ENV") === "test"
) {
  describe("Response schema validation", () => {
    test("Return true, false, false", async () => {
      const validResponse = [
        {
          id: 1,
          response: "Yes",
        },
      ];
      const invalidResponse = [
        {
          id: 1,
          response: 1,
        },
      ];
      const invalidResponse2 = {
        id: 1,
        response: "Yes",
      };

      expect(() => ResponseSchema.parse(validResponse)).not.toThrow();
      expect(() => ResponseSchema.parse(invalidResponse)).toThrow();
      expect(() => ResponseSchema.parse(invalidResponse2)).toThrow();
    });
  });
}
