const zlib = require("zlib");
const crypto = require("crypto");
/**
 * 用于url的base64encode
 * '+' => '*', '/' => '-', '=' => '_'
 * @param string str 需要编码的数据
 * @return string 编码后的base64串
 */
function base64Encode(str) {
  if (typeof str == 'object') {
    return str.toString('base64');
  }
  str = str.replace(/\+/g, '*').replace(/\//g, '-').replace(/\=/g, '_');
  let result = new Buffer(str).toString('base64');

  return result;
}

/**
 * 用于url的base64decode
 * '*' => '+', '-' => '/', '_' => '='
 * @param string base64 需要解码的base64串
 * @return string 解码后的数据
 */
function base64Decode(base64) {
  base64 = base64.replace(/\*/g, '+').replace(/-/g, '/').replace(/\_/g, '=');
  let result = new Buffer(base64, 'base64').toString();
  return result;
}

/**
 * ECDSA-SHA256签名
 * @param string data 需要签名的数据
 * @param string priKey 私钥
 * @return string 返回签名
 */
function sign(data, priKey) {
  let signLib = crypto.createSign('sha256');
  signLib.update(data);
  return signLib.sign(priKey, 'buffer');
}

/**
 * 验证ECDSA-SHA256签名
 * @param string data 需要验证的数据原文
 * @param string sig 需要验证的签名
 * @param string pubKey 公钥
 * @return int 1验证成功 0验证失败
 */
function verify(data, sig, pubKey) {
  let verify = crypto.createVerify('sha256');
  verify.update(data);
  return verify.verify(pubKey, sig);
}

/**
 * 对字符串进行gz压缩
 * @param string str 需要压缩的串
 * @param function callback 压缩后的回调，返回结果base64
 */
function gzcompress(str, callback) {

  var input = new Buffer(str, 'binary');
  var compressed = zlib.deflate(input, (err, buffer) => {
    if (err) {
      callback && callback(err, null);
    }
    else {
      let res = base64Encode(buffer);
      callback && callback(err, res);
    }
  });
}

function gzcompressSync(str) {
  var input = new Buffer(str, 'binary');
  return base64Encode(zlib.deflateSync(input));
}

/**
 * 根据json内容生成需要签名的buf串
 * @param array json 票据json对象
 * @return string 按标准格式生成的用于签名的字符串
 */
function genSignContentForUserSig(json) {
  let members = {
    'TLS.appid_at_3rd': 1,
    'TLS.account_type': 1,
    'TLS.identifier': 1,
    'TLS.sdk_appid': 1,
    'TLS.time': 1,
    'TLS.expire_after': 1
  };
  let content = '';
  for (var k in members) {
    let v = json[k];
    if (typeof v == 'undefined') {
      throw Error(`json need ${k}`);
    }
    content += k + ':' + v + "\n";
  }
  return content;
}

/**
 * 根据json内容生成需要签名的buf串
 * @param array json 票据json对象
 * @return string 按标准格式生成的用于签名的字符串
 */
function genSignContentForPrivateMapKey(json) {
  let members = {
    'TLS.appid_at_3rd': 1,
    'TLS.account_type': 1,
    'TLS.identifier': 1,
    'TLS.sdk_appid': 1,
    'TLS.time': 1,
    'TLS.expire_after': 1,
    'TLS.userbuf': 1
  };
  let content = '';
  for (var k in members) {
    let v = json[k];
    if (typeof v == 'undefined') {
      throw Error(`json need ${k}`);
    }
    content += k + ':' + v + "\n";
  }
  return content;
}

/**
 * 生成userSig 
 * @param string userID 用户名
 * @param uint sdkappID appid
 * @param uint accountType
 * @param string priKey 私钥
 * @param uint expire userSig有效期，出于安全考虑建议为300秒，您可以根据您的业务场景设置其他值。
 * @return string 生成的userSig
 */
function genUserSig({ userID, sdkAppID, accountType, priKey, expire }) {
  let json = {
    'TLS.account_type': (accountType || '0').toString(),
    'TLS.identifier': userID,
    'TLS.appid_at_3rd': '0',
    'TLS.sdk_appid': sdkAppID.toString(),
    'TLS.expire_after': (expire || '300').toString(),
    'TLS.version': '201512300000',
    'TLS.time': Math.floor(Date.now() / 1000).toString()
  };
  let content = genSignContentForUserSig(json);
  //console.log("user sig:");
  //console.log(content);
  let signature = sign(content, priKey);
  json['TLS.sig'] = signature.toString('base64');
  console.log(json['TLS.sig'])
  if (!json['TLS.sig']) {
    throw Error('base64_encode error');
  }
  let json_text = JSON.stringify(json);
  //console.log(json_text);
  return json_text;
}

/**
 * 生成privateMapKey
 * @param Object params 参数
 * 
 * @param String params.userID 用户名
 * @param Integer params.sdkAppID appid
 * @param Integer params.ccountType accountType
 * @param Integer params.roomid 房间号
 * @param String params.priKey 私钥
 * @param Integer params.expire privateMapKey有效期，出于安全考虑建议为300秒，可以根据您的业务场景设置其他值。
 * 
 * @return String 生成的privateMapKey
 */
function genPrivateMapKey({ userID, sdkAppID, accountType, roomid, priKey, expire }) {
  //视频校验位需要用到的字段
  /*
      cVer    unsigned char/1 版本号，填0
      wAccountLen unsigned short /2   第三方自己的帐号长度
      buffAccount wAccountLen 第三方自己的帐号字符
      dwSdkAppid  unsigned int/4  sdkAppID
      dwAuthId    unsigned int/4  群组号码
      dwExpTime   unsigned int/4  过期时间 （当前时间 + 有效期（单位：秒，建议300秒））
      dwPrivilegeMap  unsigned int/4  权限位
      dwAccountType   unsigned int/4  第三方帐号类型
  */
  let accountLength = userID.length;
  let time = Math.floor(Date.now() / 1000);
  let expiredTime = time + (expire || 300);
  let offset = 0;
  let bytes = new Buffer(1 + 2 + accountLength + 4 + 4 + 4 + 4 + 4);

  //cVer
  bytes[offset++] = 0;

  //wAccountLen
  bytes[offset++] = (accountLength & 0xFF00) >> 8;
  bytes[offset++] = accountLength & 0x00FF;

  //buffAccount
  for (; offset < 3 + accountLength; ++offset) {
    bytes[offset] = userID.charCodeAt(offset - 3);
  }

  //dwSdkAppid
  bytes[offset++] = (sdkAppID & 0xFF000000) >> 24;
  bytes[offset++] = (sdkAppID & 0x00FF0000) >> 16;
  bytes[offset++] = (sdkAppID & 0x0000FF00) >> 8;
  bytes[offset++] = sdkAppID & 0x000000FF;

  //dwAuthId
  bytes[offset++] = (roomid & 0xFF000000) >> 24;
  bytes[offset++] = (roomid & 0x00FF0000) >> 16;
  bytes[offset++] = (roomid & 0x0000FF00) >> 8;
  bytes[offset++] = roomid & 0x000000FF;

  //dwExpTime
  bytes[offset++] = (expiredTime & 0xFF000000) >> 24;
  bytes[offset++] = (expiredTime & 0x00FF0000) >> 16;
  bytes[offset++] = (expiredTime & 0x0000FF00) >> 8;
  bytes[offset++] = expiredTime & 0x000000FF;

  //dwPrivilegeMap
  bytes[offset++] = (255 & 0xFF000000) >> 24;
  bytes[offset++] = (255 & 0x00FF0000) >> 16;
  bytes[offset++] = (255 & 0x0000FF00) >> 8;
  bytes[offset++] = 255 & 0x000000FF;
  const zlib = require("zlib")
  const crypto = require("crypto")

  //dwAccountType
  bytes[offset++] = (0 & 0xFF000000) >> 24;
  bytes[offset++] = (0 & 0x00FF0000) >> 16;
  bytes[offset++] = (0 & 0x0000FF00) >> 8;
  bytes[offset++] = 0 & 0x000000FF;
  //console.log(bytes);
  let userbufstr = bytes.toString('base64');

  //console.log(bytes);

  let json = {
    'TLS.account_type': '0',
    'TLS.identifier': userID,
    'TLS.appid_at_3rd': '0',
    'TLS.sdk_appid': sdkAppID.toString(),
    'TLS.expire_after': (expire || 300).toString(),
    'TLS.version': '201512300000',
    'TLS.time': time.toString(),
    'TLS.userbuf': userbufstr
  };

  let content = genSignContentForPrivateMapKey(json);

  let signature = sign(content, priKey);
  json['TLS.sig'] = signature.toString("base64");

  if (!json['TLS.sig']) {
    throw Error('base64_encode error');
  }
  let json_text = JSON.stringify(json);

  return json_text;
}

exports.genPrivateMapKey = genPrivateMapKey;
exports.gzcompressSync = gzcompressSync;
exports.genUserSig = genUserSig;