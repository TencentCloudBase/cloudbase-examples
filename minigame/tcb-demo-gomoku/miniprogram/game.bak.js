
// 问题复现
// const canvas = wx.createCanvas()
// const ctx = canvas.getContext('2d')

// const canvas2 = wx.createCanvas()
// const ctx2 = canvas2.getContext('2d')

// const { windowHeight, windowWidth } = wx.getSystemInfoSync()

// console.log(windowHeight, windowWidth)

// ctx.fillStyle = 'white'
// ctx.fillRect(0, 0, windowWidth, windowHeight)

// wx.onTouchStart(event => {
//   const { pageX, pageY } = event.changedTouches[0]
//   ctx2.fillStyle = 'red'
//   ctx2.fillRect(0, 0, 20, 20)

//   ctx.drawImage(
//     canvas2,
//     0, 0, 20, 20,
//     pageX, pageY, 20, 20
//   )
//   console.log('test')
// })

// 问题解决
const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

const canvas2 = wx.createCanvas()
const ctx2 = canvas2.getContext('2d')

const { windowHeight, windowWidth } = wx.getSystemInfoSync()

function clearAll() {
  ctx.clearRect(0, 0, windowWidth, windowHeight)
}

function drawBackground() {
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, windowWidth, windowHeight)
}

function drawRect(pageX, pageY) {
  ctx2.fillStyle = 'red'
  ctx2.fillRect(0, 0, 20, 20)

  ctx.drawImage(
    canvas2,
    0, 0, 20, 20,
    pageX, pageY, 20, 20
  )
  console.log('test')
}

clearAll()
drawBackground()

wx.onTouchStart(event => {
  const { pageX, pageY } = event.changedTouches[0]
  clearAll()
  drawBackground()
  drawRect(pageX, pageY)
})
