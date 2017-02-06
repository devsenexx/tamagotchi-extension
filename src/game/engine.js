const PIXI = require('pixi.js')
require('pixi-tween') // auto added to PIXI namespace

let app = new PIXI.Application(
  window.screen.availWidth,
  window.screen.availHeight, {
    transparent: true,
    antialias: true
  })

app.view.id = 'tg-renderer'
app.view.style.position = 'absolute'
app.view.style.top = window.screen.availWidth / 2 - 150 + 'px'
app.view.style.left = window.screen.availHeight / 2 - 150 + 'px'
app.tweens = PIXI.tweenManager

document.body.appendChild(app.view)

module.exports = app
