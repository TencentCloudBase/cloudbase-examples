import { screenCtx } from './../shared/canvas.js'
import { getWindowRectSync } from './../shared/util.js'
import { BG_COLOR } from './../shared/contants.js'

class Background {
  constructor() {
    const { winWidth, winHeight } = getWindowRectSync()
    this.width = winWidth
    this.height = winHeight
  }

  render() {
    screenCtx.fillStyle = BG_COLOR
    screenCtx.fillRect(0, 0, this.width, this.height)
  }
}

export default new Background()