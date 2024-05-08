import request from "supertest";
import postSchema from "../../helpers/Schemas/post-schemas";
import envConfig from "../../configs/env-config";
import { RoleEnum } from "@prisma/client";

if (
  envConfig.getEnv("NODE_ENV") === "development" ||
  envConfig.getEnv("NODE_ENV") === "test"
) {
  describe("Post schema validation", () => {
    test("validates a valid post", () => {
      const validPost = {
        title: "Test Title",
        content: "Test Content",
        roles: [RoleEnum.Office],
        users: [{ label: "Test User", value: 1 }],
        driveLink: [{ link: "http://test.com", name: "Test Link" }],
      };

      expect(() => postSchema.parse(validPost)).not.toThrow();
    });

    test("throws an error for an invalid post", () => {
      const invalidPost = {
        title: "",
        content: "",
        roles: ["INVALID_ROLE"],
        users: [{ label: "", value: "invalid value" }],
        driveLink: [{ link: "", name: "" }],
      };

      expect(() => postSchema.parse(invalidPost)).toThrow();
    });
    test("throws an error for an invalid post", () => {
      const invalidPost = {
        title: "",
        content: "",
        users: [{ label: "", value: "invalid value" }],
        driveLink: [{ link: "", name: "" }],
      };

      expect(() => postSchema.parse(invalidPost)).toThrow();
    });
  });
}
