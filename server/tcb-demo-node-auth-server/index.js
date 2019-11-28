const Koa = require('koa');
const app = new Koa();

// 引入 TCB Admin Node 用于后续生成 Ticket
const tcb = require('tcb-admin-node');
const key = require('./tcb_custom_login.json');  // 文件内容替换为你自己的私钥
const envId = 'envid' // 替换为你自己的环境 ID

tcb.init({
    // ...
    env: envId,
    credentials: key
});

app.use(ctx => {
    let customUserId = '123456'; // 这里的 id 应当是完成自定义登陆流程后获取到的数据。

    const ticket = tcb.auth().createTicket(customUserId, {
        refresh: 10 * 60 * 1000 // 每十分钟刷新一次登录态， 默认为一小时
    });
    // 返回 Ticket
    ctx.body = JSON.stringify({
        "code" : 200,
        "data" : {
            "ticket": ticket
        }
    });

});

app.listen(3000);