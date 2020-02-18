module.exports = {
    envId: '云开发环境ID',
    functionRoot: './functions',
    functions: [
        {
            name: 'upload',
            config: {
                // 超时时间
                timeout: 60,
                // 环境变量
                envVariables: {},
                runtime: 'Nodejs8.9'
            },
            handler: 'index.main'
        },
        {
            name: 'myfile',
            config: {
                // 超时时间
                timeout: 60,
                // 环境变量
                envVariables: {},
                runtime: 'Nodejs8.9'
            },
            handler: 'index.main'
        },
        {
            name: 'downFile',
            config: {
                // 超时时间
                timeout: 60,
                // 环境变量
                envVariables: {},
                runtime: 'Nodejs8.9'
            },
            handler: 'index.main'
        },
        {
            name: 'demo',
            config: {
                // 超时时间
                timeout: 60,
                // 环境变量
                envVariables: {},
                runtime: 'Nodejs8.9'
            },
            handler: 'index.main'
        },
        {
            name: 'getFile',
            config: {
                // 超时时间
                timeout: 60,
                // 环境变量
                envVariables: {},
                runtime: 'Nodejs8.9'
            },
            handler: 'index.main'
        },
        {
            name: 'delete',
            config: {
                // 超时时间
                timeout: 60,
                // 环境变量
                envVariables: {},
                runtime: 'Nodejs8.9'
            },
            triggers:[
                {
                    "name": "deleteT",
                    "type": "timer",
                    "config": "* */10 * * * * *"
                }
            ],
            handler: 'index.main'
        }
    ]
}
