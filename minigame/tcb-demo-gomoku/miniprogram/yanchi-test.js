import './sdk/cloudsdk.beta.js'
import { db } from './shared/cloud.js'

const COLLECTION = 'times'
const TIMES = 10
const MAPS = []

async function createRow() {
  const res = await db.collection(COLLECTION).add({
    data: {
      numid: -1,
      ts: -1
    }
  })
  return res._id
}

function update(docid, numid) {
  // const date = Date.now()
  db.collection(COLLECTION)
    .doc(docid)
    .update({
      data: {
        numid,
        ts: Date.now()
      }
    })
}

function scfUpdate(docid, numid) {
  wx.cloud.callFunction({
    name: 'yanchiTest',
    data: {
      numid,
      docid,
      collection: COLLECTION,
      ts: Date.now()
    }
  })
}

async function watch(docid) {
  const watcher = db.collection(COLLECTION)
    .where({
      _id: docid
    })
    .watch({
      onChange: snapshot => {
        console.log('watch id is', snapshot.watchId)
        const { docChanges, docs } = snapshot
        if (docChanges[0].dataType !== 'update') {
          return
        }

        const doc = docs[0]
        if (doc < 0 || doc >= TIMES) {
          throw new Error('范围错误')
        }

        MAPS[doc.numid]['end'] = Date.now()
        MAPS[doc.numid]['start'] = doc.ts
      },
      onError: (error) => {
        console.log(error)
      }
    })
  console.log('watcher is', watcher)
}

async function main() {
  for (let i = 0; i < TIMES; ++i) {
    MAPS.push({
      start: -1,
      end: -1
    })
  }

  const docid = await createRow()
  watch(docid)
  setTimeout(() => {
    console.log('开始更新日志')
    for (let i = 0; i < TIMES; ++i) {
      update(docid, i)
      // scfUpdate(docid, i)
    }
  }, 1000)

  setTimeout(() => {
    let offset = 0
    for (let item of MAPS) {
      console.log(item.end, item.start, item.end - item.start)
      offset += (item.end - item.start)
    }

    console.log(offset)
    console.log(offset / TIMES)
    console.log(MAPS)
  }, 3000)
}

main()