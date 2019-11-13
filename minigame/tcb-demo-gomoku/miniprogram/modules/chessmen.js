import { screenCtx } from './../shared/canvas.js'
import { getWindowRectSync } from './../shared/util.js'
import {
  CHESS_BLACK_NUM,
  CHESS_WHITE_NUM,
  CHESS_EMPTY_NUM,
  CHESS_BLACK_COLOR,
  CHESS_WHITE_COLOR
} from './../shared/contants.js'
import music from './music.js'

class Chessmen {
  constructor() {
    const { winWidth, winHeight } = getWindowRectSync()

    this.x = 0.05 * winWidth
    this.y = 0.15 * winHeight
    this.width = 0.9 * winWidth
    this.height = 0.8 * winHeight

    this.titleHeight = 0.2 * this.height
    this.mainHeight = 0.8 * this.height

    this.title = '等待玩家加入'

    // 棋盘在其上canvas的偏移量
    this.chessmenOffX = 0
    this.chessmenOffY = 0
    this.chessmenPadding = 10
    this.chessmenLog = []

    for (let i = 0; i < 15; ++i) {
      this.chessmenLog[i] = []
      for (let j = 0; j < 15; ++j) {
        this.chessmenLog[i][j] = CHESS_EMPTY_NUM
      }
    }

    this.titleCanvas = wx.createCanvas()
    this.mainCanvas = wx.createCanvas()
    this.titleCtx = this.titleCanvas.getContext('2d')
    this.mainCtx = this.mainCanvas.getContext('2d')
  }

  updateTitle(title) {
    this.title = title
  }

  drawTitle() {
    const { titleCtx } = this
    
    // 绘制棋盘上方颜色
    titleCtx.fillStyle = '#fffbe6'
    titleCtx.fillRect(0, 0, this.width, this.titleHeight)

    // 绘制棋盘上方字体
    titleCtx.fillStyle = 'white'
    titleCtx.textAlign = 'center'
    titleCtx.font = "18px Arial"
    titleCtx.fillStyle = 'black'
    titleCtx.fillText(this.title, this.width * 0.5, this.titleHeight * 0.5)
  }
  
  drawMain(num = 15) {
    const { mainCtx } = this
    mainCtx.fillStyle = '#ffe58f'
    mainCtx.fillRect(0, 0, this.width, this.mainHeight)

    // 绘制棋盘背景
    const width = num * 20,
      height = num * 20
    
    this.chessmenOffX = (this.width - width) / 2
    this.chessmenOffY = (this.mainHeight - height) / 2

    mainCtx.fillStyle = '#faad14'
    mainCtx.fillRect(this.chessmenOffX, this.chessmenOffY, width, height)

    // 绘制棋盘线条 
    mainCtx.strokeStyle = 'black'
    for (let i = 0; i < num; ++i) {
      // 水平线条
      mainCtx.moveTo(this.chessmenPadding + this.chessmenOffX, this.chessmenOffY + this.chessmenPadding + i * 20)
      mainCtx.lineTo(this.chessmenOffX + 290, this.chessmenOffY + this.chessmenPadding + i * 20)
      mainCtx.stroke()
      
      // 垂直线条
      mainCtx.moveTo(this.chessmenPadding + i * 20 + this.chessmenOffX, this.chessmenPadding + this.chessmenOffY)
      mainCtx.lineTo(this.chessmenPadding + i * 20 + this.chessmenOffX, this.chessmenOffY + 290)
      mainCtx.stroke()
    }
  }

  drawChess() {
    const R = 8
    const { mainCtx } = this

    for (let row = 0; row < 15; ++row) {
      for (let col = 0; col < 15; ++col) {
        if (this.chessmenLog[row][col] === CHESS_EMPTY_NUM) {
          continue
        }

        const color = this.chessmenLog[row][col] === CHESS_BLACK_NUM ? CHESS_BLACK_COLOR : CHESS_WHITE_COLOR
        const circleY = this.chessmenPadding + this.chessmenOffY + row * 20
        const circleX = this.chessmenPadding + this.chessmenOffX + col * 20

        mainCtx.beginPath()
        mainCtx.arc(circleX, circleY, R, 0, 2 * Math.PI)
        mainCtx.fillStyle = color
        mainCtx.fill()
      }
    }
  }

  _putDown(row, col, color) {
    if (color !== CHESS_BLACK_COLOR && color !== CHESS_WHITE_COLOR) {
      return {
        success: false
      }
    }

    if (col < 0 || col > 14 || row < 0 || row > 14) {
      return {
        success: false
      }
    }

    if (this.chessmenLog[row][col] !== CHESS_EMPTY_NUM) {
      return {
        success: false
      }
    } else {
      this.chessmenLog[row][col] = color === CHESS_BLACK_COLOR ? CHESS_BLACK_NUM : CHESS_WHITE_NUM
    }

    this.chessmenLog[row][col] = color === CHESS_BLACK_COLOR ? CHESS_BLACK_NUM : CHESS_WHITE_NUM

    music.playFallAudio()

    return { col, row, success: true }
  }

  putDown(_x, _y, color) {
    // 计算(_x, _y)相当于Main部分的坐标值(x, y)
    const x = _x - this.x - this.chessmenOffX
    const y = _y - this.titleHeight - this.y - this.chessmenOffY
    if (x <= 0 || y <= 0) {
      return {
        success: false
      }
    }

    let col = Math.round((x - this.chessmenPadding) / 20),
      row = Math.round((y - this.chessmenPadding) / 20)

    return this._putDown(row, col, color)
  }

  render() {
    this.drawTitle()
    this.drawMain()
    this.drawChess()

    screenCtx.drawImage(
      this.titleCanvas, 
      0, 0, this.width, this.titleHeight, 
      this.x, this.y, this.width, this.titleHeight
    )

    screenCtx.drawImage(
      this.mainCanvas, 
      0, 0, this.width, this.mainHeight, 
      this.x, this.y + this.titleHeight, this.width, this.mainHeight
    )
  }
}

export default new Chessmen()
