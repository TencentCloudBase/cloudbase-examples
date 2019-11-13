const config = require('./config')
const {
  SecretID,
  SecretKey,
} = config
const TcbService = require('tcb-service-sdk');
const tcbService = new TcbService()

exports.main = async (event, context) => {

  let {
    Name = '',
    IdCard = ''
  } = event

  try {
    let result = await tcbService.callService({
        service: 'ai',
        action: 'IdCardVerification',
        data: {
          Name,
          IdCard
        },
        options: {
          secretID: SecretID,
          secretKey: SecretKey
        }
      })

    return result
  }
  catch (e) {
    return { code: 1, message: e.message }
  }
}