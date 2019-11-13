const config = require('./config')
const {
  SecretID,
  SecretKey,
} = config
const TcbService = require('tcb-service-sdk')
const tcbService = new TcbService()

exports.main = async (event) => {
  const {
    MaxFaceNum,
    MinFaceSize,
    FileID,
    Url,
    NeedFaceAttributes = 1,
    NeedQualityDetection = 1,
  } = event

  try {

    let fileContent = await tcbService.utils.getContent({
      fileID: FileID,
      url: Url
    })

    if (!fileContent) {
      return { code: 10002, message: 'image content is empty' }
    }

    const result = await tcbService.callService({
      service: 'ai',
      action: 'DetectFace',
      data: {
        MaxFaceNum,
        MinFaceSize,
        Image: fileContent.toString('base64'),
        Url,
        NeedFaceAttributes,
        NeedQualityDetection
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
