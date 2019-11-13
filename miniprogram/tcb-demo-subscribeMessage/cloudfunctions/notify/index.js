// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let data = async cloud.database.collection('users').get()
  return await cloud.openapi.subscribeMessage.send({
    touser: 'oQJnN4oFuvkONPEaRruUkoPaxhno', // 替换为用户的 OPEN ID，可以使用 cloud.database.collection 的方法查询出需要发送提醒的用户。
    page: 'pages/userConsole/userConsole', // 替换为点开提醒卡片时对应的路径
    data: {
      phrase1: {                          // 这里的参数需要修改为你自己的
        value: '出票成功'                  // 这里的参数需要修改为你自己的
      },
      thing2: {                            // 这里的参数需要修改为你自己的
        value: '2015年01月05日'           // 这里的参数需要修改为你自己的
      }
    },
    templateId: '8rxAIKK5CDT7cJaXKIPF6L41jul55DQjBXw1LeZFd_U'   // 这里的参数需要替换为你自己在后台添加的模板的 模板 ID
  })
}