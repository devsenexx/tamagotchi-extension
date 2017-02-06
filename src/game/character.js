let PIXI = require('pixi.js')

class Character {
  constructor (conf) {
    if (!conf.engine) {
      throw new Error('Engine must be specified in character config')
    }
    this.engine = conf.engine
    this.conf = conf
    this.create()
    this.engine.view.id = 'tg-renderer'
    document.body.appendChild(this.engine.view)
  }

  create () {
    PIXI.loader.add(this.conf.name, this.conf.asset)
      .load((loader, res) => {
        console.debug("Creating character:", this.conf)

        this.char = new PIXI.Sprite(res[this.conf.name].texture)

        this.char.x = this.engine.renderer.width / 2
        this.char.y = this.engine.renderer.height / 2
        this.char.width = 200
        this.char.height = 132
        this.char.anchor.x = 0.5
        this.char.anchor.y = 0.5

        this.engine.stage.addChild(this.char)

        this.engine.ticker.add(() => {
          this.char.rotation += 0.01
        })
      })
  }

  // move (newX, newY) {
  //   view = this.engine.view
  //   oldX = view.x
  //   oldY = view.y
  //   while (oldX != newX && oldY != newY) {
  //
  //   }
  // }
}

module.exports = Character
