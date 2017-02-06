const PIXI = require('pixi.js')
require('pixi-tween') // auto added to PIXI namespace

// Awesome P2 font
// fontEl = document.createElement('link')
// fontEl.href = 'https://fonts.googleapis.com/css?family=Press+Start+2P'
// fontEl.rel = 'stylesheet'
// document.head.appendChild(fontEl)
//
// fontPreloader = document.createElement('div')
// fontPreloader.style.fontFamily = 'Press Start 2P'
// document.body.appendChild(fontPreloader)

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

window.__TG = app
module.exports = app
