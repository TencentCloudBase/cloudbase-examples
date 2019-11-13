const { sessionSecret } = require('../config/index');
const crypto = require('crypto');
/**
 * 根据openid和session_key加密生成session作为生成自己派发的session_id
 * @param {string} openid
 * @param {string} session_key
 * @return {3rd_session}自己派发的session
 */
function createSession (openid, session_key) {
  return crypto
    .createHmac('sha256', sessionSecret)
    .update(`${openid}:${session_key}`)
    .digest('hex')
}
module.exports = createSession
