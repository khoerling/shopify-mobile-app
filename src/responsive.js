
const screen = require('Dimensions').get('window')

// simulate EM by changing font size according to ratios
const ratioX = screen.width < 375 ? (screen.width < 320 ? 0.75 : 0.875) : 1,
      ratioY = screen.height < 568 ? (screen.height < 480 ? 0.75 : 0.875) : 1,
      unit   = 16 * ratioX
const em = val => unit * val

module.exports = {
  em,
  unit,
  ratioX,
  ratioY,
}
