const PIXI = require('pixi.js')

class Character {
  constructor(conf) {
    if (!conf.engine) {
      throw new Error('Engine must be specified in character config')
    }
    this.engine = conf.engine
    this.conf = conf
    this.create()
  }

  create() {
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

        this.engine.view.onclick = () => {
          this.move(10, 10)
        }
      })
  }

  // moveTo(newX, newY, duration = 1000) {
  //   this.engine.ticker.add(this._moveToTickerFn(newX, newY, duration))
  // }
  //
  // move(byX, byY, duration = 1000) {
  //   let pos = this.engine.view.getBoundingClientRect(),
  //       newX = pos.left + byX,
  //       newY = pos.top + byY
  //
  //   this.engine.ticker.add(this._moveToTickerFn(newX, newY, duration))
  // }
  //
  // _moveToTickerFn(newX, newY, duration) {
  //   let view = this.engine.view,
  //       pos = view.getBoundingClientRect(),
  //       yReverse = pos.top > newY,
  //       xReverse = pos.left > newX,
  //       yDistance = (newY - pos.top) / duration,
  //       xDistance = (newX - pos.left) / duration
  //
  //   return (delta) => {
  //     let t = parseInt(view.style.top),
  //       l = parseInt(view.style.left)
  //
  //     view.style.top = t + yDistance / delta + 'px'
  //     view.style.left = l + xDistance / delta + 'px'
  //
  //     if ((t > newY + yDistance || yReverse && t < newY + yDistance) &&
  //       (l > newX + xDistance || xReverse && l < newX + xDistance)) {
  //       this.engine.ticker.remove(this._moveToTickerFn)
  //     }
  //   }
  // }
}

module.exports = Character
