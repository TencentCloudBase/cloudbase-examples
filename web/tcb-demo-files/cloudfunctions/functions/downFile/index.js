const tcb = require("tcb-admin-node");
tcb.init();
const db = tcb.database();
const _ = db.command;

exports.main = async event => {
    let result = {};
    console.log(event);
    try{
        let files = (await db.collection('file').where({
            no:event.no,
            key:event.key
        }).get()).data;
        if(files.length!==0){
            result.url = (await tcb.getTempFileURL({
                fileList: [files[0].fileurl]
            })).fileList[0].download_url;

            result.name = files[0].name;
            result.code = 0;

            if(files[0].one===true){
                await db.collection('file').doc(files[0]._id).remove();
                await db.collection('manage').doc('FILEID').update({
                    free:_.push([files[0].no])
                });
                await db.collection('dustbin').add({
                    time:new Date(),
                    file:files[0].fileurl
                });
            }
        }
        else{
            result.code = 1;
        }
    }
    catch(e){
        console.log(e);
        result.code = -1;
        result.err = e;
    }
    return result;
};


