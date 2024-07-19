import request from "supertest";
import { app, server } from "../../app";
import envConfig from "../../configs/env-config";

if (
  envConfig.getEnv("NODE_ENV") === "development" ||
  envConfig.getEnv("NODE_ENV") === "test"
) {
    describe('GET /allExams', () => {
        it('should return the exams', async () => {
            const response = await request(app)
              .get(`/exams/allExams`)
              .set('Cookie', ['accessToken='+ envConfig.getEnv('TEST_TOKEN')]);
    
            expect(response.status).toBe(200);
    
            expect(response.body).toContainEqual({
              ScheduleForDayId: null,
              comments: null,
              dayOfExamsId: 40,
              endTime: "2024-04-11T00:35:00.000Z",
              id: 19,
              issues: null,
              levels: ["A1", "A2"],
              location: "Praha",
              note: "",
              pdfUrl: null,
              startTime: "2024-04-11T11:00:00.000Z",
              type: "Computer",
              venue: "Ict Pro"
          });
          })
        }
    );

    describe('POST /createExam', () => {
        it('should create an exam', async () => {
            const response = await request(app)
              .post(`/exams/createExam`)
              .send({
                venue: "Ict Pro",
                location: "Brno",
                type: "Computer",
                levels: ["A1", "A2"],
                startTime: '07:00',
                endTime: '18:30',
                note: "",
                dayOfExamsId: 53,
              })
              .set('Cookie', ['accessToken='+ envConfig.getEnv('TEST_TOKEN')]);
    
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Exam created' });
          })
        });

    afterAll(async () => {
        server.close();
      });
}
