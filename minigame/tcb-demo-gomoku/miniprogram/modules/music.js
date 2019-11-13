import { getTempFileURL } from './../shared/cloud.js'
import config from './../shared/config.js'

const { fallAudioID, bgAudioID } = config.audio

class Music {
  constructor() {
    this.fallAudio = wx.createInnerAudioContext()
    this.bgAudio = wx.createInnerAudioContext()
    this.init()
  }

  async init() {
    Promise.all([
      getTempFileURL(fallAudioID),
      getTempFileURL(bgAudioID)
    ])
    .then(values => {
      const [fallUrl, bgUrl] = values
      if (bgUrl) {
        this.bgAudio.autoplay = true
        this.bgAudio.loop = true
        this.bgAudio.volume = 0.2
        this.bgAudio.src = bgUrl
      }

      if (fallUrl) {
        this.fallAudio.autoplay = false
        this.fallAudio.loop = false
        this.fallAudio.src = fallUrl
      }
    })
  }

  playFallAudio() {
    this.fallAudio.play()
  }

  playBgAudio() {
    this.bgAudio.play()
  }
}

const music = new Music()
wx.onShow(() => music.playBgAudio())
wx.onAudioInterruptionEnd(() => music.playBgAudio())

export default music
