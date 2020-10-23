// const config = require("./config");
// const { SecretID, SecretKey } = config;
const TcbService = require("tcb-service-sdk");
const request = require("request");
const COS = require("cos-nodejs-sdk-v5");
const tcbService = new TcbService();
const CUSTOMER_ERROR_MAP = {
  10001: { code: 10001, message: "外部资源加载失败" },
  10002: { code: 10002, message: "外部资源太大, 超过3.75M" }
};

const BASE64_SIZE_LIMIT = 5 * 1024 * 1024;

exports.main = async event => {
  const {
    MaxFaceNum,
    MinFaceSize,
    FileID,
    NeedFaceAttributes = 1,
    NeedQualityDetection = 1
  } = event;
  let { Url, Image } = event;

  try {
    if (MinFaceSize < 0) {
      throw { code: 10005, message: "MinFaceSize 参数错误。" };
    }

    if (FileID) {
      let { fileList } = await tcbService.cloud.getTempFileURL({
        fileList: [FileID]
      });
      let fileResult = fileList[0];
      if (fileResult.status) {
        throw { ...CUSTOMER_ERROR_MAP[10001], message: fileResult.errMsg };
      } else {
        Url = fileResult.tempFileURL;
      }
    }

    if (Url) {
      let contentLength = await (FileID
        ? new Promise((resolve, reject) => {
            let cos = new COS({
              getAuthorization: function(opt, callback) {
                callback({
                  TmpSecretId: process.env.TENCENTCLOUD_SECRETID,
                  TmpSecretKey: process.env.TENCENTCLOUD_SECRETKEY,
                  XCosSecurityToken: process.env.TENCENTCLOUD_SESSIONTOKEN,
                  // 单次调用保证密钥在有效期内
                  ExpiredTime: Math.floor(new Date().getTime() / 1000) + 70
                });
              }
            });
            let reg = /cloud:\/\/(.*?)\.(.*?)\/(.*)$/;
            let [id, env, bucket, key] = reg.exec(FileID) || [];
            if (bucket && key) {
              cos.headObject(
                {
                  Bucket: bucket,
                  Key: key,
                  Region: "ap-shanghai"
                },
                function(err, data) {
                  if (err) {
                    console.log("cos headObject error:", err);
                    reject(CUSTOMER_ERROR_MAP[10001]);
                  } else {
                    let { "content-length": contentLength = 0 } =
                      (data && data.headers) || {};
                    resolve(parseInt(contentLength, 10));
                  }
                }
              );
            } else {
              console.log("Can't parse bucket or key", bucket, key);
              reject(CUSTOMER_ERROR_MAP[10001]);
            }
          })
        : new Promise((resolve, reject) => {
            request.head(Url, {}, function(error, res, body) {
              if (error) {
                console.log("headObject error:", error);
                reject(CUSTOMER_ERROR_MAP[10001]);
              }
              let { "content-length": contentLength = 0 } =
                (res && res.headers) || {};
              resolve(contentLength);
            });
          }));
      if (contentLength > (BASE64_SIZE_LIMIT / 4) * 3) {
        throw CUSTOMER_ERROR_MAP[10002];
      }
    } else if (Image) {
      try {
        if (Image.length > BASE64_SIZE_LIMIT) {
          throw CUSTOMER_ERROR_MAP[10002];
        }
      } catch (e) {}
    }

    const result = await tcbService.callService({
      service: "ai",
      action: "DetectFace",
      data: {
        MaxFaceNum,
        MinFaceSize,
        Url,
        Image,
        NeedFaceAttributes,
        NeedQualityDetection
      } /*,
      options: {
        secretID: SecretID,
        secretKey: SecretKey
      }*/
    });

    if (result.code) {
      switch (result.code) {
        case "FailedOperation.ImageSizeExceed":
          throw CUSTOMER_ERROR_MAP[10002];
        case "ResourceUnavailable.Freeze":
        case "ResourceUnavailable.InArrears":
        case "ResourceUnavailable.NotExist":
        case "ResourceUnavailable.Recover":
        case "ResourceUnavailable.StopUsing":
        case "ResourceUnavailable.UnknownStatus":
        case "ResourcesSoldOut.ChargeStatusException":
          throw { code: 10004, message: result.message };
        default:
          throw { code: 10005, message: result.message };
      }
    }

    return result;
  } catch (e) {
    return { code: e.code || 10003, message: e.message };
  }
};
