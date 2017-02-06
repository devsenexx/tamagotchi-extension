const PIXI = require('pixi.js')
require('pixi-tween') // auto added to PIXI namespace

let app = new PIXI.Application(
  document.body.clientWidth,
  200, {
    transparent: true,
    antialias: true
  })

app.view.id = 'tg-renderer'
// app.view.style.pointerEvents = 'none'
app.view.style.position = 'fixed'
app.view.style.bottom = 0
app.view.style.left = 0
app.tweens = PIXI.tweenManager

document.body.appendChild(app.view)

module.exports = app
