const crypto = require('crypto');
const fs = require('fs');

class Sign {
  constructor(keyPath, accessToken, time) {
    this.KeyPath = keyPath;
    this.AccessToken = accessToken;
    this.Timestamp = time;
  }

  sign() {
    const signData = this.AccessToken + '.' + this.Timestamp;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signData);
    signer.end();

    const key = fs.readFileSync(this.KeyPath, 'utf8');

    const signature_b64 = signer.sign(key, 'base64');

    return {
      accessToken: this.AccessToken,
      timeStamp: this.Timestamp,
      signature: signature_b64,
    };
  }
}

module.exports = Sign;
