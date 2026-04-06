const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'XYP API',
      version: '1.0.0',
      description: 'API for XYP Government System integration',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        SignatureRequest: {
          type: 'object',
          required: ['signature', 'serialNumber', 'timestamp'],
          properties: {
            signature: {
              type: 'string',
              description: 'Digital signature',
            },
            serialNumber: {
              type: 'string',
              description: 'Certificate serial number',
            },
            timestamp: {
              type: 'string',
              description: 'Timestamp used for signing',
            },
          },
        },
        OtpRequest: {
          type: 'object',
          required: ['otp', 'timestamp', 'accessToken', 'signature'],
          properties: {
            otp: {
              type: 'string',
              description: 'OTP code received by citizen',
            },
            timestamp: {
              type: 'string',
              description: 'Timestamp used when requesting OTP',
            },
            accessToken: {
              type: 'string',
              description: 'Access token from XYP',
            },
            signature: {
              type: 'string',
              description: 'Signature from XYP',
            },
          },
        },
        SignRequest: {
          type: 'object',
          required: ['timestamp'],
          properties: {
            timestamp: {
              type: 'string',
              description: 'Timestamp to sign',
            },
          },
        },
        SignResponse: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
            },
            timestamp: {
              type: 'string',
            },
            signature: {
              type: 'string',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;