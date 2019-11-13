const config = require('./config')
const {
  SecretID,
  SecretKey,
} = config
const TcbService = require('tcb-service-sdk');
const tcbService = new TcbService()

exports.main = async (event) => {
  let {
    ProjectId = config.ProjectId,
    ModelId = config.ModelId,
    RspImgType = 'url',
    FileID
  } = event

  try {

    let fileContent = await tcbService.utils.getContent({
      fileID: FileID
    })

    if (!fileContent) {
      return { code: 10002, message: 'fileContent is empty' }
    }
    
    let result = await tcbService.callService({
      service: 'ai',
      action: 'FaceFusion',
      data: {
        ProjectId,
        ModelId,
        RspImgType,
        Image: fileContent.toString('base64'),
      },
      options: {
        secretID: SecretID,
        secretKey: SecretKey
      }
    });

    return result
  }
  catch (e) {
    return {code: 10001, message: e.message}
  }
};
