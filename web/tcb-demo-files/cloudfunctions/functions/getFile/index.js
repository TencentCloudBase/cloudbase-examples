const tcb = require("tcb-admin-node");
const request = require('request');
const TCaptchaID = {
    aid:'',//腾讯验证码项目aid
    AppSecretKey:''//腾讯验证码项目Secretkey
};
//允许源列表，在这里配置哪个地址的网站才可以访问这个函数Http服务
const AllowOriginList = [
    ''
]
tcb.init();
let CallWeb = (obj) =>{
    return new Promise((resolve, reject) => {
        request({
            url:'https://ssl.captcha.qq.com/ticket/verify?aid='+TCaptchaID.aid+'&AppSecretKey='+TCaptchaID.AppSecretKey+
                '&Ticket='+obj.ticket+
                '&Randstr=' + obj.randstr +
                '&UserIP =' + obj.ip,
            method:'GET'
        }, (error, response, body) => {
            if (error) {
                reject(error);
            }
            resolve((typeof response.body === 'object') ? response.body : JSON.parse(response.body));
        });
    });
}

exports.main = async event => {
    let AllowOrigin= AllowOriginList[0];
    if(AllowOriginList.indexOf(event.headers.origin)!=-1){
        AllowOrigin = event.headers.origin;
    }
    console.log(event.body);
    let result = {};
    const ip = event.headers["x-real-ip"];
    if(event.body!=null && event.body[0]==='{' && JSON.parse(event.body).code!=null){
        const data = JSON.parse(event.body);
        result = await CallWeb({
            ticket:data.code.ticket,
            randstr:data.code.randstr,
            ip:ip
        });
        if(result.err_msg==="OK"){
            result = await tcb.callFunction({
                name: "downFile",
                data: data
            });
        }
        else{
            result.code=300;
        }
    }
    else{
        result.code=404;
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': AllowOrigin,
            'Access-Control-Allow-Methods':"POST,OPTIONS",
            'Access-Control-Max-Age':'3600',
            'Access-Control-Allow-Headers':'Content-Type'
        },
        body: {
            result
        }
    };
}