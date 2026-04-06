const crypto = require('crypto');
const fs = require('fs');
const soap = require('soap');

class XypService {
  constructor(config = {}) {
    this.config = {
      token: config.token || process.env.XYP_TOKEN,
      keyPath: config.keyPath || process.env.XYP_KEY,
      regnum: config.regnum || process.env.REGNUM,
      url: config.url || 'https://xyp.gov.mn/citizen-1.5.0/ws?WSDL',
      ...config,
    };
  }

  createSignature(accessToken, timestamp) {
    const signData = `${accessToken}.${timestamp}`;
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signData);
    sign.end();

    const key = fs.readFileSync(this.config.keyPath, 'utf8');

    const signature = sign.sign(key, 'base64');

    console.log({ signature });

    return {
      accessToken,
      timestamp,
      signature,
    };
  }

  async getCitizenInfoByOTP(otp) {
    const args = {
      request: {
        regnum: this.config.regnum,
        auth: {
          citizen: {
            civilId: '',
            regnum: this.config.regnum,
            fingerprint: '',
            otp: otp,
            authType: 1,
          },
          operator: {
            regnum: '',
            fingerprint: '',
          },
        },
      },
    };

    const timestamp = Math.floor(+new Date() / 1000);

    const signData = this.createSignature(this.config.token, timestamp);

    const result = await this._makeSoapRequest(args, signData);

    return result;
  }

  async _makeSoapRequest(args, signData) {
    return new Promise((resolve, reject) => {
      soap.createClient(
        this.config.url,
        { endpoint: this.config.url },
        (err, client) => {
          if (err) {
            return reject(err);
          }

          client.addHttpHeader('accessToken', signData.accessToken);
          client.addHttpHeader('timeStamp', signData.timestamp.toString());
          client.addHttpHeader('signature', signData.signature);

          client.WS100101_getCitizenIDCardInfo(args, (err, result) => {
            console.log({ result });
            if (err) {
              // console.error(err);
              return reject(err);
            }
            resolve(result);
          });
        },
      );
    });
  }
}

module.exports = XypService;
