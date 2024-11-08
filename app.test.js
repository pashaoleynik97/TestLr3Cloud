const request = require('supertest');
const app = require('./app');
let server;

beforeAll(() => {
  server = app.listen(3000);  // Запуск сервера на тестовому порту
});

afterAll((done) => {
  server.close(done);  // Закриття сервера після завершення тестів
});

describe('GET /getPageMeta', () => {
  it('should return metadata for a valid URL', async () => {
    const response = await request(app).get('/getPageMeta?pageUrl=https://example.com');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('faviconUrl');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('domainUrl');
    expect(response.body.domainUrl).toBe('example.com');
  });

  it('should return an error for an invalid URL', async () => {
    const response = await request(app).get('/getPageMeta?pageUrl=https://invalid-url.com');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Page can not be reached. Check your URL and try again',
    });
  });

  it('should return an error if pageUrl is missing', async () => {
    const response = await request(app).get('/getPageMeta');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Page URL is required',
    });
  });
});
