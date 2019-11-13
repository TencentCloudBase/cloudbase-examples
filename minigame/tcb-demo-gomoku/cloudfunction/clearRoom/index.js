const tcb = require('tcb-admin-node')

const collection = 'rooms' // 存放房间的数据库名称

const app = tcb.init({
  env: tcb.getCurrentEnv(),
  timeout: 5000
})
const db = app.database()

exports.main = async (event, context) => {
  let { roomid } = event

  try {
    const { data } = await db.collection(collection)
      .where({ roomid })
      .get()
    if (!data.length) {
      return
    }

    const target = data[0]
    await db.collection(collection)
      .doc(target._id)
      .remove()
  } catch (error) {
    console.log(error.message)
  }
}