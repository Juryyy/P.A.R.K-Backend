import request from "supertest";
import {app, server} from '../../app';
import envConfig from "../../configs/env-config";

if (
  envConfig.getEnv("NODE_ENV") === "development" ||
  envConfig.getEnv("NODE_ENV") === "test"
) {

  describe("GET BAD /profile/:id", () => {
    it("should return 404 if user not found", async () => {
      const response = await request(app)
        .get(`/users/profile/48`)
        .set("Cookie", ["accessToken=" + envConfig.getEnv("TEST_TOKEN")]);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User does not exists" });
    });
  });

  describe("GET /profile/:id", () => {
    it("should return the user profile", async () => {
      const response = await request(app)
        .get(`/users/profile/1`)
        .set("Cookie", ["accessToken=" + envConfig.getEnv("TEST_TOKEN")]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 48,
        email: "martin.sulc2551@gmail.com",
        firstName: "Martin",
        lastName: "Šulc",
        phone: "123456789",
        drivingLicense: false,
        role: "Office",
        avatarUrl: null,
        activatedAccount: false,
        deactivated: false,
        adminNote: null,
        note: null,
        _count: {
          examinedExams: 0,
          invigilatedExams: 0,
          supervisedExams: 0,
        },
      });
    });
  });

  afterAll(async () => {
    server.close();
  });
}
