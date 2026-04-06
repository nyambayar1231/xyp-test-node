const request = require('supertest');
const app = require('../src/app');

describe('Swagger API Documentation', () => {
  test('GET /api-docs should return Swagger UI', async () => {
    const response = await request(app).get('/api-docs/');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  test('GET /api-docs/swagger.json should return OpenAPI spec', async () => {
    const response = await request(app).get('/api-docs/swagger.json');
    
    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.0');
    expect(response.body.info.title).toBe('XYP API');
    expect(response.body.paths['/api/xyp/sign']).toBeDefined();
    expect(response.body.paths['/api/xyp/signature']).toBeDefined();
    expect(response.body.paths['/api/xyp/otp']).toBeDefined();
  });
});