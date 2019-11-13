const md5 = require('md5')

function getPushUrl(domain, bizid, streamId, key = null) {

  let extStr = ''

  if (key) {
    let txTime = `${(parseInt(Date.now() / 1000) + 3600 * 24).toString(16)}`.toUpperCase()
    let txSecret = md5(`${key}${streamId}${txTime}`)
    extStr = `?bizid=${bizid}&txSecret=${txSecret}&txTime=${txTime}`
  }

  return `rtmp://${domain}/live/${streamId}${extStr}`
}

function getPlayUrl(domain, streamId) {
  return [
    `rtmp://${domain}/live/${streamId}`,
    `http://${domain}/live/${streamId}.flv`,
    `http://${domain}/live/${streamId}.m3u8`
  ]
}

module.exports = {
  getPushUrl,
  getPlayUrl
}