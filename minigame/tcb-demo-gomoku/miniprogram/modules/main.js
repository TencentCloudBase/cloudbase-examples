import background from './background.js'
import head from './head.js'
import chessmen from './chessmen.js'
import './player.js'
import { getWindowRectSync } from './../shared/util.js'
import { screenCtx } from './../shared/canvas.js'

const { winWidth, winHeight } = getWindowRectSync()

class Main {
  constructor() {
    this.objs = [
      background,
      head,
      chessmen,
    ]
    this.render()
  }

  render() {
    screenCtx.clearRect(0, 0, winWidth, winHeight)

    for (let obj of this.objs) {
      (typeof obj.render === 'function') && (obj.render())
    }
  }
}

export default new Main()
