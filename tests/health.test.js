const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  test('GET /health should return status ok', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });
});