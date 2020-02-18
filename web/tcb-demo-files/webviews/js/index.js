const envID = '云开发环境ID'
/**
 * 启动服务
 */
window.onload=function(){
    try{
        initTcb();
    }
    catch(e){
        toHide(['mainTool','itemView-0','itemView-1']);
        showModel('此浏览器不支持文件服务，请到其他浏览器打开！', 40000, 'error');
    }
};

/**
 * 云开发SDK初始化服务（匿名登录）
 * @param success 成功的callback
 */
function initTcb(success=()=>{}) {
    app = tcb.init({
        env: envID
    });
    const auth = app.auth();
    auth.signInAnonymously().then(() => {
        auth.getLoginState().then((e) => {
            uid = e.credential.refreshToken;
            console.log('匿名登录成功，初始化完成！');
            initFlag = true;
            success();
        });
    }).catch(err => {
        showModel('初始化失败，请检查网络后重新刷新页面！如果一直出现此情况请反馈给腾讯云云开发', 10000, 'error');
    });
}

/**
 * 切换操作面板
 * @param flag 面板号
 */
function changeView(flag){
    if(flag===viewFlag) return;
    editClass('toolItem-'+flag,{
        add:['tool-item-select']
    });
    if(viewFlag>=0){
        editClass('toolItem-'+viewFlag,{
            remove:['tool-item-select']
        });
        toHide(['itemView-'+viewFlag]);
    }
    else{
        toHide(['itemView-0']);
        toHide(['setView-main-2']);
        toShow(['setView-main-0','setView-des-0']);
    }
    toShow(['itemView-'+flag]);
    viewFlag=flag;
}

/**
 * 获取我上传的文件
 */
function getMyNetFile() {
    if (initFlag) {
        app.callFunction({
            name:'myfile',
            data:{
                uid:uid
            }
        }).then(res => {
            console.log(res);
            try{
            showModel('我的文件列表获取成功！', 3000, 'success');
                let html='';
                for(let item of res.result.files){
                    let NTime = (6-(new Date().getTime()-new Date(item.due).getTime())/1000/3600).toFixed(2);
                    if(NTime.length>4)NTime=NTime.slice(0,4);
                    html+='<tr><td>'+item.name+'</td><td>'+item.no+'</td><td>'+(item.key!==''?item.key:'无')+'</td><td>'+NTime+'小时</td></tr>';
                }
                if(res.result.files.length===0){
                    html+='<td>目前没有在有效期内上传的文件！</td>';
                }
                document.getElementById('FileList').innerHTML=html;
            }
            catch (e) {
                alert(e);
            }
        });
    }else {
        showModel('当前未初始化，请重新刷新页面！如果一直出现此情况请反馈给腾讯云云开发', 10000, 'error');
    }
}

/**
 * 获取选择上传的文件
 * @param file 文件元素
 */
function getFile(file) {
    if (file.files.length !== 0) {
        getElm("chooseFile").innerText='重选文件';
        editClass("chooseFile",{
            add:['default-btn'],
            remove:['large-btn'],
            style:''
        });
        toShow(['setModel','upload']);
        toHide(['MyFilesBtn']);
        document.getElementById("fileName").innerText=file.files[0].name;
        progressShow(0);
        fileSaver = file;
    }
}

/**
 * 上传文件
 */
function uploadFile() {
    if (initFlag) {
        editClass('uploadBtnText',{
            text:'存储中'
        });
        editClass('upload',{
            addT:[{
                name:'disabled',
                value:''
            }]
        });
        let fileName = fileSaver.files[0].name;
        let nowTime = new Date().getTime();

        //SDK上传文件
        app.uploadFile({
            cloudPath: uid+'/'+nowTime+'/'+fileName,
            filePath: fileSaver.files[0],
            //上传监听
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                progressShow(percentCompleted);
            }
        },function (err,res) {
            if(err){
                console.log(err);
                showModel('上传文件失败，请重新尝试上传！[权限或网络异常]', 3000, 'warning');
                editClass('uploadBtnText',{
                    text:'存储文件'
                });
                editClass('upload',{
                    removeT:['disabled']
                });
            }
            else{
                editClass('uploadBtnText',{
                    text:'确认中'
                });
                app.callFunction({
                    name:'upload',
                    data:{
                        file:res.fileID,
                        key:getElm('userKey').value,
                        name:fileName,
                        one:getElm('oneTime').checked,
                        uid:uid
                    }
                }).then(res => {
                    console.log(res);
                    if(res.result.code===0){
                        showModel('上传文件成功！', 3000, 'success');
                        toHide(['setView-main-0']);
                        editClass('DesFileName',{
                            text:res.result.name
                        });
                        editClass('DesFileNo',{
                            text:res.result.no
                        });
                        editClass('DesFileKey',{
                            text:res.result.key!==''?res.result.key:'无'
                        });
                        toShow(['setView-main-1']);
                    }
                    else{
                        showModel('文件确认失败，请检查网络重新上传！如果这不是第一次，可能使用人太多，请稍后再试', 6000, 'error');
                        app.deleteFile({
                            fileList: [res.fileID]
                        });
                        editClass('uploadBtnText',{
                            text:'存储文件'
                        });
                        editClass('upload',{
                            removeT:['disabled']
                        });
                    }
                }).catch(err =>{
                    showModel('文件确认失败，请检查网络重新尝试上传！[权限或网络异常]', 6000, 'error');
                    app.deleteFile({
                        fileList: [res.fileID]
                    });
                    editClass('uploadBtnText',{
                        text:'存储文件'
                    });
                    editClass('upload',{
                        removeT:['disabled']
                    });
                });
            }
        });
    } else {
        showModel('当前未初始化，请重新刷新页面！如果一直出现此情况请反馈给腾讯云云开发', 10000, 'error');
    }
}

/**
 * 显示我的文件列表面板
 */
function showMyFiles() {
    toHide(['setView-main-0','setView-des-0']);
    toShow(['setView-main-2']);
    editClass('toolItem-'+viewFlag,{
        remove:['tool-item-select']
    });
    viewFlag=-1;
    getMyNetFile();
}

/**
 * 复制上传凭证
 * @constructor
 */
function CopyLink(){
    let text = 'File-S|跨平台文件转储取件凭证【你的最终部署上线网址】\n文件名：'+getElm('DesFileName').innerText+
                '\n取件号码：'+getElm('DesFileNo').innerText+
                '\n取件密码：'+getElm('DesFileKey').innerText+'\n\n文件将在存储后6小时内删除（一次即删除外），请及时下载！\n本服务由腾讯云云开发提供';
    copyToClipboard ({
        text:text,
        success(){
            showModel('已经复制到剪贴板，保存成功！', 3000, 'success');
        },
        fail(){
            showModel('你的浏览器不支持复制到剪贴板，保存失败！', 6000, 'warning');
        }
    })
}

/**
 * 切换至上传文件状态
 */
function toUpload() {
    editClass("chooseFile",{
        add:['large-btn'],
        remove:['default-btn'],
        style:'margin: auto auto 10px;'
    });
    getElm("chooseFile").innerText='选择文件';
    toHide(['setModel','upload']);
    editClass('uploadBtnText',{
        text:'存储文件'
    });
    editClass('upload',{
        removeT:['disabled']
    });
    toHide(['setView-main-1']);
    toShow(['setView-main-0','MyFilesBtn']);
}

/**
 * 上传过程进度条
 * @param i
 */
function progressShow(i){
    editClass("progress",{
        style:'width:'+i+'%'
    });
}

/**
 * 监听文件取件号码输入
 * @param e
 */
function getFileNo(e) {
    if(e.value!==""){
        editClass('TencentCaptcha',{
            removeT:['disabled']
        })
    }
    else{
        editClass('TencentCaptcha',{
            addT:[{
                name:'disabled',
                value:''
            }]
        })
    }
}



/**
 * 下载文件请求函数
 * @param res 腾讯验证码
 */
function downloadFile(res) {
    if(res.ret!==0)return;
    if(isWeClient()){
        showModel('此浏览器不支持下载文件，请用其他浏览器！',10000,'error');
        return;
    }
    let no = getElm('downNo').value;
    let key = getElm('downKey').value;
    editClass('TencentCaptcha',{
        addT:[{
            name:'disabled',
            value:''
        }]
    });
    editClass('downloadBtnText',{
        text:'下载请求中'
    });
    calls({
        url:'https://'+envID+'.service.tcloudbase.com/getFile',
        data:{
            uid:uid,
            no:no,
            key:key,
            code:res
        },
        success(res){
            if(res.result.result.code===0){
                showModel('文件请求成功，正在拉起下载！', 3000, 'success');
                downLoad(res.result.result.url,res.result.result.name);
                editClass('TencentCaptcha',{
                    removeT:['disabled']
                });
                editClass('downloadBtnText',{
                    text:'下载文件'
                });
            }
            else if(res.result.result.code===1){
                showModel('取件号码不存在，或者密码错误！', 6000, 'warning');
                editClass('TencentCaptcha',{
                    removeT:['disabled']
                });
                editClass('downloadBtnText',{
                    text:'下载文件'
                });
            }
            else{
                showModel('系统繁忙，可能使用人数太多，请稍后再试！', 6000, 'error');
                editClass('TencentCaptcha',{
                    removeT:['disabled']
                });
                editClass('downloadBtnText',{
                    text:'下载文件'
                });
            }
        },
        fail(){
            showModel('系统繁忙，维护中，请稍后再试！', 6000, 'error');
            editClass('TencentCaptcha',{
                removeT:['disabled']
            });
            editClass('downloadBtnText',{
                text:'下载文件'
            });
        }
    });
}