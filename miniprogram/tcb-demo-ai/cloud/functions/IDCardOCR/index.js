const config = require('./config')
const {
  SecretID,
  SecretKey,
} = config
const TcbService = require('tcb-service-sdk')
const tcbService = new TcbService()

exports.main = async (event) => {
  const {
    FileID,
    ImageUrl,
    CardSide = 'FRONT',
    Config,
  } = event

  try {

    let fileContent = await tcbService.utils.getContent({
      fileID: FileID,
      url: ImageUrl
    })

    if (!fileContent) {
      return { code: 10002, message: 'image content is empty' }
    }

    const result = await tcbService.callService({
      service: 'ai',
      action: 'IDCardOCR',
      data: {
        ImageBase64: fileContent.toString('base64'),
        ImageUrl,
        CardSide,
        Config,
      },
      options: {
        secretID: SecretID,
        secretKey: SecretKey
      }
    })

    return result
  }
  catch (e) {
    return { code: 10001, message: e.message }
  }
}
