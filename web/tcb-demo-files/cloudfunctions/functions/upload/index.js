const tcb = require("tcb-admin-node");
tcb.init();
const db = tcb.database();
const _ = db.command;

exports.main = async event => {
    let result = {};
    console.log(event);
    try{
        const transaction = await db.startTransaction();
        let Ids=(await transaction.collection('manage').doc('FILEID').get()).data;
        let no = null;
        if(Ids.free.length!=0){
            no = Ids.free[0];
            await transaction.collection('manage').doc('FILEID').update({
                free:_.shift()
            })
        }
        else{
            console.log(Ids.num);
            if(Ids.num < 1000 && Ids.num > 99){
                no = '0'+Ids.num;
            }
            else if(Ids.num < 100 && Ids.num > 9){
                no = '00'+Ids.num;
            }
            else if(Ids.num < 10 && Ids.num >= 0){
                no = '000'+Ids.num;
            }
            else{
                no = (Ids.num).toString();
            }
            console.log(no);
            await transaction.collection('manage').doc('FILEID').update({
                num:_.inc(1)
            })
        }
        await transaction.collection('file').add({
            due: new Date(),
            fileurl: event.file,
            no: no,
            key: event.key,
            name: event.name,
            one: event.one,
            uid: event.uid
        })
        await transaction.commit();
        result.no = no;
        result.name = event.name;
        result.key = event.key;
        result.code = 0;
    }
    catch(e){
        console.log(e);
        result.code = -1;
        result.err = e;
    }
    return result;
};


