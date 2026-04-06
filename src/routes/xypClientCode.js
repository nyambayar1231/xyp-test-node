require('dotenv').config();
const sign = require('./xypSign');

process.title = 'node-chat';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const soap = require('soap');
let url = 'https://xyp.gov.mn/citizen-1.5.0/ws?WSDL';

class XypClientCode {
  constructor() {}

  /**
   * Иргэнийг тоон гарын үсгээр баталгаажуулж WS100101_getCitizenIDCardInfo сервисийн 1.5.0 хувилбарыг дуудах
   * @param signature regnum.timestamp датаг тоон гарын үсгээр баталгаажуулсан дата
   * @param serialNumber иргэний тоон гарын үсгийн сериал дугаар
   * @param time тоон гарын үсэг зурхад ашиглагдсан timestamp
   *
   * @author buyndelger
   * @since 2023-05-17
   */
  XypClientSignature(signature, serialNumber, time) {
    const data = new sign(process.env.XYP_KEY, process.env.XYP_TOKEN, time);
    const signData = data.sign();
    const args = {
      request: {
        regnum: process.env.REGNUM,
        auth: {
          citizen: {
            authType: 2, // 1-OTP, 2-Тоон гарын үсэг, 3-Хурууны хээ
            civilId: '',
            regnum: process.env.REGNUM,
            certFingerprint: serialNumber,
            fingerprint: '',
            signature: signature,
          },
          operator: {
            regnum: '',
            fingerprint: '',
          },
        },
      },
    };

    soap.createClient(url, { endpoint: url }, function (err, client) {
      client.addHttpHeader('accessToken', signData.accessToken);
      client.addHttpHeader('timeStamp', signData.timeStamp.toString());
      client.addHttpHeader('signature', signData.signature);

      client.WS100101_getCitizenIDCardInfo(args, function (err, result) {
        console.log(err);
        console.log(result);
        console.log(result.return.request.auth.citizen);
      });
    });
  }

  /**
   * Иргэнийг OTP кодоор баталгаажуулж WS100101_getCitizenIDCardInfo сервисийн 1.5.0 хувилбарыг дуудах
   * @param otp иргэнд мэдэгдлээр очсон otp дугаар
   * @param time тоон гарын үсэг зурхад ашиглагдсан timestamp
   * @param signData otp дугаар авах үед ашиглагдсан хурSign -н мэдээлэл
   *
   * @author buyndelger
   * @since 2023-05-17
   */
  XypClientOTP(otp, time, signData) {
    const args = {
      request: {
        regnum: process.env.REGNUM,
        auth: {
          citizen: {
            civilId: '',
            regnum: process.env.REGNUM,
            fingerprint: '',
            otp: otp,
            authType: 1, // 1-OTP, 2-Тоон гарын үсэг, 3-Хурууны хээ
          },
          operator: {
            regnum: '',
            fingerprint: '',
          },
        },
      },
    };

    soap.createClient(url, { endpoint: url }, function (err, client) {
      client.addHttpHeader('accessToken', signData.accessToken);
      client.addHttpHeader('timeStamp', signData.timeStamp.toString());
      client.addHttpHeader('signature', signData.signature);

      client.WS100101_getCitizenIDCardInfo(args, function (err, result) {
        console.log(err);
        console.log(result);
        console.log(result.return.request.auth.citizen);
      });
    });
  }
}

module.exports = XypClientCode;
