const PIXI = require('pixi.js')
require('pixi-tween') // auto added to PIXI namespace

let app = new PIXI.Application(300, 300, { transparent: true, antialias: true })

app.view.id = 'tg-renderer'
app.view.style.position = 'absolute'
app.view.style.top = window.screen.availWidth / 2 - 150 + 'px'
app.view.style.left = window.screen.availHeight / 2 - 150 + 'px'

document.body.appendChild(app.view)

module.exports = app
