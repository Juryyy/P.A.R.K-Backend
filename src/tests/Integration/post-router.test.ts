import request from "supertest";
import { app, server } from "../../app";
import envConfig from "../../configs/env-config";

/* router.post('/create', jwtAccessVerify, officeMiddleware.isOffice, postController.createPost);
router.get('/posts', jwtAccessVerify, postController.getPostsForUser);
 */

if (
  envConfig.getEnv("NODE_ENV") === "development" ||
  envConfig.getEnv("NODE_ENV") === "test"
) {

  describe("POST /create", () => {
    it("should create a post", async () => {
      const response = await request(app)
        .post(`/posts/create`)
        .send({
          authorId: 1,
          content: "Test of post creation",
          driveLink: [{ name: "Test", link: "test.txt" }],
          roles: [
            "Office",
            "Supervisor",
            "Invigilator",
            "SeniorInvigilator",
            "Tech",
            "SeniorSupervisor",
            "Examiner",
          ],
          title: "Test of post creation",
          users: [{ label: "Martin Šulc", value: 1 }],
        })
        .set("Cookie", ["accessToken=" + envConfig.getEnv("TEST_TOKEN")]);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Post created" });
    });
  });

  describe("GET /posts", () => {
    it("should return the posts", async () => {
      const response = await request(app)
        .get(`/posts/posts`)
        .set("Cookie", ["accessToken=" + envConfig.getEnv("TEST_TOKEN")]);

      expect(response.status).toBe(200);
      expect(response.body).toContainEqual({
        authorId: 1,
        content: "Test of post creation",
        driveLink: [{ name: "Test", link: "test.txt" }],
        roles: [
          "Office",
          "Supervisor",
          "Invigilator",
          "SeniorInvigilator",
          "Tech",
          "SeniorSupervisor",
          "Examiner",
        ],
        title: "Test of post creation",
        users: [{ label: "Martin Šulc", value: 1 }],
      })
      });
    });

  afterAll(async () => {
    server.close();
  });
}
