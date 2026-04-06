const express = require('express');
const XypService = require('../services/xypService');

function createXypRouter(xypService = new XypService()) {
  const router = express.Router();

  /**
   * @swagger
   * /api/xyp/sign:
   *   post:
   *     summary: Create a signature
   *     description: Generates a digital signature using the XYP token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignRequest'
   *     responses:
   *       200:
   *         description: Signature created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SignResponse'
   *       400:
   *         description: Missing required field
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post('/sign', (req, res) => {
    try {
      const { timestamp } = req.body;

      if (!timestamp) {
        return res
          .status(400)
          .json({ error: 'Missing required field: timestamp' });
      }

      const signData = xypService.createSignature(
        xypService.config.token,
        timestamp,
      );
      res.json(signData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @swagger
   * /api/xyp/signature:
   *   post:
   *     summary: Get citizen info by digital signature
   *     description: Authenticates citizen using digital signature and retrieves ID card info
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignatureRequest'
   *     responses:
   *       200:
   *         description: Citizen information retrieved successfully
   *       400:
   *         description: Missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post('/signature', async (req, res) => {
    try {
      const { signature, serialNumber, timestamp } = req.body;

      if (!signature || !serialNumber || !timestamp) {
        return res.status(400).json({
          error: 'Missing required fields: signature, serialNumber, timestamp',
        });
      }

      const result = await xypService.getCitizenInfoBySignature(
        signature,
        serialNumber,
        timestamp,
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @swagger
   * /api/xyp/otp:
   *   post:
   *     summary: Get citizen info by OTP
   *     description: Authenticates citizen using OTP code and retrieves ID card info
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/OtpRequest'
   *     responses:
   *       200:
   *         description: Citizen information retrieved successfully
   *       400:
   *         description: Missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  router.post('/otp', async (req, res) => {
    try {
      const { otp } = req.body;

      const result = await xypService.getCitizenInfoByOTP(otp);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createXypRouter;
