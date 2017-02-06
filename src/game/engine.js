const PIXI = require('pixi.js')
let app = new PIXI.Application(300, 300, { transparent: true, antialias: true })
let batUrl = chrome.extension.getURL('assets/img/bat-stasis.png')

document.body.appendChild(app.view)

PIXI.loader.add('bat', batUrl)
  .load(function (loader, res) {
    console.debug("Creating bat")

    let bat = new PIXI.Sprite(res.bat.texture)

    bat.x = app.renderer.width / 2
    bat.y = app.renderer.height / 2
    bat.width = 200
    bat.height = 132
    bat.anchor.x = 0.5
    bat.anchor.y = 0.5

    app.stage.addChild(bat)

    app.ticker.add(function () {
      bat.rotation += 0.01
    })
  })

module.exports = app
