const request = require('supertest');
const express = require('express');
const createXypRouter = require('../src/routes/xypRoutes');

describe('XYP Routes', () => {
  let mockXypService;
  let app;

  beforeEach(() => {
    mockXypService = {
      createSignature: jest.fn(),
      getCitizenInfoBySignature: jest.fn(),
      getCitizenInfoByOTP: jest.fn(),
      config: { token: 'test-token' }
    };
    
    app = express();
    app.use(express.json());
    app.use('/api/xyp', createXypRouter(mockXypService));
  });

  describe('POST /api/xyp/sign', () => {
    test('should return signature when timestamp is provided', async () => {
      const mockSignData = {
        accessToken: 'test-token',
        timestamp: '1234567890',
        signature: 'mock-signature'
      };
      mockXypService.createSignature.mockReturnValue(mockSignData);

      const response = await request(app)
        .post('/api/xyp/sign')
        .send({ timestamp: '1234567890' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSignData);
      expect(mockXypService.createSignature).toHaveBeenCalledWith('test-token', '1234567890');
    });

    test('should return 400 when timestamp is missing', async () => {
      const response = await request(app)
        .post('/api/xyp/sign')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required field: timestamp');
    });

    test('should return 500 when service throws error', async () => {
      mockXypService.createSignature.mockImplementation(() => {
        throw new Error('Service error');
      });

      const response = await request(app)
        .post('/api/xyp/sign')
        .send({ timestamp: '1234567890' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Service error');
    });
  });

  describe('POST /api/xyp/signature', () => {
    test('should return citizen info when all fields are provided', async () => {
      const mockResult = { citizen: { name: 'Test User' } };
      mockXypService.getCitizenInfoBySignature.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/xyp/signature')
        .send({
          signature: 'test-signature',
          serialNumber: 'test-serial',
          timestamp: '1234567890'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(mockXypService.getCitizenInfoBySignature).toHaveBeenCalledWith(
        'test-signature',
        'test-serial',
        '1234567890'
      );
    });

    test('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/xyp/signature')
        .send({ signature: 'test-signature' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required fields');
    });

    test('should return 500 when service throws error', async () => {
      mockXypService.getCitizenInfoBySignature.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .post('/api/xyp/signature')
        .send({
          signature: 'test-signature',
          serialNumber: 'test-serial',
          timestamp: '1234567890'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Service error');
    });
  });

  describe('POST /api/xyp/otp', () => {
    test('should return citizen info when all fields are provided', async () => {
      const mockResult = { citizen: { name: 'Test User' } };
      mockXypService.getCitizenInfoByOTP.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/api/xyp/otp')
        .send({
          otp: '123456',
          timestamp: '1234567890',
          accessToken: 'test-token',
          signature: 'test-signature'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(mockXypService.getCitizenInfoByOTP).toHaveBeenCalledWith(
        '123456',
        '1234567890',
        { accessToken: 'test-token', timestamp: '1234567890', signature: 'test-signature' }
      );
    });

    test('should return 400 when required fields are missing', async () => {
      const response = await request(app)
        .post('/api/xyp/otp')
        .send({ otp: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing required fields');
    });

    test('should return 500 when service throws error', async () => {
      mockXypService.getCitizenInfoByOTP.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .post('/api/xyp/otp')
        .send({
          otp: '123456',
          timestamp: '1234567890',
          accessToken: 'test-token',
          signature: 'test-signature'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Service error');
    });
  });
});