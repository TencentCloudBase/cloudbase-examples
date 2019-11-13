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
      action: 'GeneralBasicOCR',
      data: {
        ImageBase64: fileContent.toString('base64'),
        ImageUrl,
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
