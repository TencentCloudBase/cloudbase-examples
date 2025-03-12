

exports.main = function (event, context) {
  return {
   request: `${context.httpContext.httpMethod} ${context.httpContext.url}`,
   now: new Date().toISOString(),
   event,
  }
}
