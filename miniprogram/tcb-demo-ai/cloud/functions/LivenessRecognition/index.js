const config = require('./config')
const {
  SecretID,
  SecretKey,
} = config
const TcbService = require('tcb-service-sdk')
const tcbService = new TcbService()

exports.main = async (event) => {
  const {
    IdCard,
    Name,
    VideoFileID,
    LivenessType = 'SILENT',
    ValidateData
  } = event

  try {
    let fileContent = await tcbService.utils.getContent({
      fileID: VideoFileID
    })

    if (!fileContent) {
      return { code: 10002, message: 'fileContent is empty' }
    }

    const result = await tcbService.callService({
      service: 'ai',
      action: 'LivenessRecognition',
      data: {
        IdCard,
        Name,
        VideoBase64: fileContent.toString('base64'),
        LivenessType,
        ValidateData
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