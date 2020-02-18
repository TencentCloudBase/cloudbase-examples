const tcb = require("tcb-admin-node");
tcb.init();
const db = tcb.database();
const _ = db.command;

exports.main = async event => {
    let result = {};
    console.log(event);
    try{
        let files = (await db.collection('file').where({
            due:_.lt(new Date(new Date().getTime()-21600000))
        }).get()).data;

        let ids = [];
        let urls = [];
        files.map(function(item){
            ids.push(item.no);
            urls.push(item.fileurl);
        });
        console.log('空闲的NO:',ids);

        await db.collection('manage').doc('FILEID').update({
            free:_.push(ids)
        });

        await tcb.deleteFile({
            fileList: urls
        });

        await db.collection('file').where({
            due:_.lt(new Date(new Date().getTime()-21600000))
        }).remove();

        let dustbin = (await db.collection('dustbin').where({
            time:_.lt(new Date(new Date().getTime()-600000))
        }).get()).data;

        let dustutl = [];
        dustbin.map(function(item){
            dustutl.push(item.file);
        });

        await tcb.deleteFile({
            fileList: dustutl
        });

        await db.collection('dustbin').where({
            time:_.lt(new Date(new Date().getTime()-600000))
        }).remove();

    }
    catch(e){
        console.log(e);
        result.code = -1;
        result.err = e;
    }
    return result;
};


