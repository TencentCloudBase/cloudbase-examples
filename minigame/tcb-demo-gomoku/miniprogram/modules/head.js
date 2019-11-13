import { screenCtx } from './../shared/canvas.js'
import { getWindowRectSync } from './../shared/util.js'
import { HEAD_COLOR } from './../shared/contants.js'

class Head {
  constructor(text) {
    this.text = text || '在线对战五子棋'
    
    const { winWidth, winHeight } = getWindowRectSync()
    this.width = winWidth
    this.height = winHeight
  }

  updateText(text) {
    this.text = text
  }

  drawText() {
    screenCtx.textAlign = 'center'
    screenCtx.font = "16px Arial"
    screenCtx.fillStyle = 'white'
    screenCtx.fillText(this.text, this.width * 0.5, this.height * 0.08)
  }

  drawHead() {
    screenCtx.fillStyle = HEAD_COLOR
    screenCtx.fillRect(0, 0, this.width, this.height * 0.2)
  }

  render() {
    this.drawHead()
    this.drawText()
  }
}

export default new Head()
