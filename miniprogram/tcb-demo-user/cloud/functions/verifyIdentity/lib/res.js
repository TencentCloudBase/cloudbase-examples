const Res = function ({ code = 0, message = '', data = null }) {
  this.code = code
  this.message = message
  this.data = data
}

module.exports = Res
