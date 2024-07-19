import request from 'supertest';
import {app, server} from '../../app';
import envConfig from '../../configs/env-config';

if(envConfig.getEnv('NODE_ENV') === 'development' || envConfig.getEnv('NODE_ENV') === 'test'){
    describe('GET /respones', () => {
        it('should return the responses', async () => {
            const response = await request(app)
              .get(`/responses/responses`)
              .set('Cookie', ['accessToken='+ envConfig.getEnv('TEST_TOKEN')]);

            expect(response.status).toBe(200);

            //{"date": "2024-05-30T00:00:00.000Z", "id": 130, "isLocked": false, "response": "Maybe"}
            expect(response.body).toContainEqual({
                date: "2024-05-30T00:00:00.000Z",
                id: 130,
                isLocked: false,
                response: 'Maybe'
              });
            })
        }
    );

    describe('GET /responsesExamDay/:id', () => {
        it('should return the responses for the exam day', async () => {
            const response = await request(app)
              .get(`/responses/responsesExamDay/47`)
              .set('Cookie', ['accessToken='+ envConfig.getEnv('TEST_TOKEN')]);

            expect(response.status).toBe(200);
            expect(response.body).toContainEqual({
                dayOfExamsId: 47,
                id: 130,
                response: "Maybe",
                userName: "Martin Šulc",
                userRole: "Office"
            });
            })
        }
    );
            //update { id: 151, response: 'Maybe' } to { id: 151, response: 'Yes' }
    describe('PUT /update', () => {
        it('should update the responses', async () => {
            const response = await request(app)
              .put(`/responses/update`)
              .send([{ id: 151, response: 'Yes' }])
              .set('Cookie', ['accessToken='+ envConfig.getEnv('TEST_TOKEN')]);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Responses updated' });

            const response_new = await request(app)
              .get(`/responses/responses`)
              .set('Cookie', ['accessToken='+ envConfig.getEnv('TEST_TOKEN')]);

            expect(response_new.status).toBe(200);
            expect(response_new.body).toContainEqual({
                date:"2024-05-23T00:00:00.000Z",
                id:151,
                isLocked:false,
                response:"Yes"
            });
        });
    });

    afterAll(async () => {
      server.close();
    });
}
