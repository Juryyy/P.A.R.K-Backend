import request from 'supertest';
import mockFs from 'mock-fs';
import app from '../../app'; // Import your Express app

describe('POST /upload', () => {
    beforeAll(() => {
        // Mock the file system
        mockFs({
            'static/': {}, // Mock the uploads directory
        });
    });

    afterAll(() => {
        // Restore the file system
        mockFs.restore();
    });

    it('should upload a file', async () => {
        const response = await request(app)
            .post('/users/upload')
            .attach('avatar', Buffer.from('This is a test file'), 'test.jpg')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzQsImVtYWlsIjoiYmFncjJAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiVGVzdDIiLCJsYXN0TmFtZSI6IlVzZXIiLCJkcml2aW5nTGljZW5zZSI6ZmFsc2UsIm5vdGUiOm51bGwsImFkbWluTm90ZSI6bnVsbCwicm9sZSI6Ik9mZmljZSIsImF2YXRhclVybCI6bnVsbCwiYWN0aXZhdGVkQWNjb3VudCI6ZmFsc2UsImlhdCI6MTcwNDU1MzkyOSwiZXhwIjoxNzA1ODQ5OTI5fQ.DsiKvgnZ_2W5BOOCuXOnp71Ozr0FVJEAFMTPXdmZkOg'
            }`); // Set your test token

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Avatar updated');
    });
});

