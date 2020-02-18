const tcb = require("tcb-admin-node");
tcb.init();
const db = tcb.database();
const _ = db.command;

exports.main = async event => {
    let result = {};
    console.log(event);
    try{
        result.files = (await db.collection('file').where({
            uid:event.uid
        }).field({
            no:true,
            name:true,
            key:true,
            due:true
        }).get()).data;
        result.code = 0;
    }
    catch(e){
        console.log(e);
        result.code = -1;
        result.err = e;
    }
    return result;
};


