import main from './main.js'
import chessmen from './chessmen.js'
import head from './head.js'
import { db, $ } from './../shared/cloud.js'
import { 
  genRandomNumber, 
  encodeArray, 
  decodeArray, 
  diffArray,
  sleep
} from './../shared/util.js'
import { 
  CHESS_BLACK_NUM, 
  CHESS_WHITE_NUM, 
  CHESS_EMPTY_NUM,
  CHESS_BLACK_COLOR,
  CHESS_WHITE_COLOR
} from './../shared/contants.js'

const COLLECTION = 'rooms'

class Player {
  constructor() {
    this.color = ''
    this.lines = 15
    this.roomid = ''
    this.docid = ''
    this.canRun = false
    this.log = []

    this.watcher = {
      player: null, // 针对player开启的监听器
      remote: null // 针对远程更新开启的监听器
    }
    
    this.init()
  }

  async init() {
    for (let i = 0; i < this.lines; ++i) {
      this.log[i] = []
      for (let j = 0; j < this.lines; ++j) {
        this.log[i][j] = CHESS_EMPTY_NUM
      }
    }

    const identity = await this.judgeIdentity()
    const that = this

    wx.onTouchStart((event) => this.handleTouch(event))

    wx.onHide(() => {
      if (!that.roomid) {
        return
      }
      wx.exitMiniProgram({
        complete: () => {
          wx.cloud.callFunction({
            name: 'clearRoom',
            data: { roomid: that.roomid }
          })
        }
      })
    })

    if (identity === 'owner') {
      this.waitPlayerJoinGame()
    } else {
      chessmen.updateTitle('等待对手下棋')
      main.render()
      await this.updatePeopleField()
      this.listenRemoteRefresh()
    }
  }

  async judgeIdentity() {
    const { list: rooms } = await db.collection(COLLECTION)
      .aggregate()
      .match({
        people: $.eq(1)
      })
      .sort({
        createTimestamp: -1
      })
      .limit(1)
      .end()

    let room = null
    if (!rooms.length) {
      room = await this.createEmptyRoom()
    } else {
      room = rooms[0]
    }

    this.color = rooms.length ? CHESS_WHITE_COLOR : CHESS_BLACK_COLOR
    this.roomid = room.roomid
    this.docid = room._id
    this.canRun = false

    head.updateText(`房间号 ${this.roomid}`)
    main.render()

    return rooms.length ? 'player' : 'owner'
  }

  async createEmptyRoom() {
    const roomid = genRandomNumber(6)
    const { data } = await db.collection(COLLECTION)
      .where({ roomid })
      .get()
    if (data.length) {
      await this.createEmptyRoom()
      return
    }

    let room = {
      roomid,
      nextcolor: 'black',
      chessmen: encodeArray(this.log),
      createTimestamp: Date.now().toString(),
      people: 1
    }

    const res = await db.collection(COLLECTION).add({ data: room })
    
    return {
      ...room,
      _id: res._id
    }
  }

  async updatePeopleField() {
    await wx.cloud.callFunction({
      name: 'updateDoc',
      data: {
        collection: COLLECTION,
        docid: this.docid,
        data: {
          people: 2
        }
      }
    })
  }

  async handleTouch(event) {
    if (!this.canRun) {
      console.log('没有轮到你')
      return
    } else {
      this.canRun = false
    }

    const { clientX, clientY } = event.touches[0]
    const { success, col, row } = chessmen.putDown(clientX, clientY, this.color)
    if (!success) {
      console.log('请点击正确的位置')
      return
    }
    
    this.log[row][col] = this.color === CHESS_BLACK_COLOR ? CHESS_BLACK_NUM : CHESS_WHITE_NUM
    chessmen.updateTitle('等待对手下棋')
    main.render()
    console.log('触摸后，更新本地棋盘', row, col, this.log[row][col])

    const canJudge = this.judgeWinOrLose(row, col, this.log)
    if (canJudge) {
      this.exit(row, col, this.log)
    }

    try {
      const res = await wx.cloud.callFunction({
        name: 'updateDoc',
        data: {
          collection: COLLECTION,
          docid: this.docid,
          data: {
            chessmen: encodeArray(this.log),
            nextcolor: this.color === CHESS_BLACK_COLOR ? CHESS_WHITE_COLOR : CHESS_BLACK_COLOR
          }
        }
      })
      console.log('云函数返回', res)
      console.log('触摸后，更新远程棋盘')
    } catch (error) {
      console.log('触摸后，更新远程棋盘 失败')
    }
  }

  waitPlayerJoinGame() {
    this.watcher.player = 
      db.collection(COLLECTION)
        .where({
          _id: this.docid
        })
        .watch({
          onChange: snapshot => {
            const { docs, docChanges } = snapshot
            console.log('waitPlayerGame', snapshot)
            if (docChanges[0].dataType === 'update' && docs[0].people === 2) {
              this.canRun = true
              chessmen.updateTitle('轮到你下棋')
              main.render()
              this.watcher.player.close()
              this.listenRemoteRefresh()
            }
          },
          onError: error => {}
        })
  } 

  listenRemoteRefresh() {
    this.watcher.remote = 
      db.collection(COLLECTION)
        .where({
          _id: this.docid
        })
        .watch({
          onChange: snapshot => {
            const docChange = snapshot.docChanges[0]
            const doc = snapshot.docs[0]

            if (docChange.dataType === 'remove') {
              chessmen.updateTitle('对方退出, 请重新进入')
              main.render()
              this.watcher.remote.close()
              return
            }

            if (
              docChange.dataType !== 'update'
              || !docChange.updatedFields
              || !docChange.updatedFields.chessmen
            ) {
              console.log('不是chessmen字段更新')
              return
            }

            if (doc.nextcolor !== this.color) {
              console.log('不轮到你')
              return
            } 

            const shape = [this.lines, this.lines]
            const decoded = decodeArray(doc.chessmen, shape)
            const [x, y] = diffArray(decoded, this.log, shape)
            this.log[x][y] = decoded[x][y]
            const canJudge = this.judgeWinOrLose(x, y, this.log)

            if (!canJudge) {
              chessmen.updateTitle('轮到你下棋')
              this.canRun = true
            } 
            chessmen._putDown(x, y, decoded[x][y] === CHESS_BLACK_NUM ? CHESS_BLACK_COLOR : CHESS_WHITE_COLOR)
            main.render()
            if (canJudge) {
              this.exit(x, y, this.log)
            }
          },

          onError: error => {}
        })
  }

  judgeWinOrLose(x, y, log) {
    if (!Array.isArray(log)) {
      log = this.log
    }
    const { lines } = this
    let num = 0, target = log[x][y]
    if (target !== CHESS_BLACK_NUM && target !== CHESS_WHITE_NUM) {
      return false
    }

    // 垂直方向
    num = 0
    for (let i = y - 1; i >= 0 && target === log[x][i]; --i) {
      ++num
    }
    for (let i = y + 1; i < lines && target === log[x][i]; ++i) {
      ++num
    }
    if (num >= 4) {
      console.log('垂直方向，胜利')
      return true
    }

    // 水平方向
    num = 0
    for (let i = x - 1; i >= 0 && target === log[i][y]; --i) {
      ++num
    }
    for (let i = x + 1; i < lines && target === log[i][y]; ++i) {
      ++num
    }
    if (num >= 4) {
      console.log('水平方向，胜利')
      return true
    }

    // 左倾斜方向
    num = 0
    for (
      let i = x - 1, j = y - 1;
      i >= 0 && j >= 0 && target === log[i][j];
      --i, --j
    ) {
      ++num
    }
    for (
      let i = x + 1, j = y + 1;
      i < lines && j < lines && target === log[i][j];
      ++i, ++j
    ) {
      ++num
    }
    if (num >= 4) {
      console.log('左倾斜方向，胜利')
      return true
    }

    // 右倾斜方向
    num = 0
    for (
      let i = x - 1, j = y + 1;
      i >= 0 && j < lines && target === log[i][j];
      --i, ++j
    ) {
      ++num
    }
    for (
      let i = x + 1, j = y - 1;
      i < lines && j >= 0 && target === log[i][j];
      ++i, --j
    ) {
      ++num
    }
    if (num >= 4) {
      console.log('右倾斜方向，胜利')
      return true
    }

    return false
  }
  
  async exit(row, col) {
    this.watcher.remote.close()
    this.canRun = false

    const target = this.log[row][col]
    const color = target === CHESS_BLACK_NUM 
      ? CHESS_BLACK_COLOR
      : CHESS_WHITE_COLOR
    const map = {
      [CHESS_BLACK_COLOR]: '黑棋',
      [CHESS_WHITE_COLOR]: '白棋'
    }

    if (color === this.color) {
      chessmen.updateTitle(`恭喜, ${map[this.color]}胜利`)
    } else {
      chessmen.updateTitle(`可惜, ${map[this.color]}失败`)
    }
    main.render()
    await sleep(2000)

    chessmen.updateTitle('2秒后自动退出')
    main.render()
    await sleep(2000)
    
    const that = this
    wx.exitMiniProgram({
      complete: () => {
        wx.cloud.callFunction({
          name: 'clearRoom',
          data: { roomid: that.roomid }
        })
      }
    })
  }
}

export default new Player()
