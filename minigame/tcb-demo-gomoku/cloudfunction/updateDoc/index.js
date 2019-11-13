const tcb = require('tcb-admin-node')
const app = tcb.init({
  env: tcb.getCurrentEnv(),
  timeout: 5000
})
const db = app.database()

exports.main = async (event, context) => {
  let { collection, docid, data } = event

  try {
    const res = await db.collection(collection)
      .doc(docid)
      .update({
        ...data
      })

    console.log('res is', res)
    // 有错误码
    if (res.code) {
      return {
        code: 1,
        msg: res.message
      }
    } else {
      return {
        code: 0,
        msg: 'success'
      }
    }
  } catch (error) {
    console.log(error.message)
    return {
      code: 1,
      msg: error.message
    }
  }
}
