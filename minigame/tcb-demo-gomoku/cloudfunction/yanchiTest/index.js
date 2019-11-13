const tcb = require('tcb-admin-node')
const app = tcb.init({
  env: tcb.getCurrentEnv(),
  timeout: 5000
})
const db = app.database()

exports.main = async (event, context) => {
  let { numid, collection, docid, ts } = event

  console.log('numid is', numid, '; docid is', docid, '; collection is', collection)

  try {
    const res = await db.collection(collection)
      .doc(docid)
      .update({
        numid,
        ts,
      })
    console.log('res is', res)
  } catch (error) {
    console.log('error is', error)
  }
    
}
