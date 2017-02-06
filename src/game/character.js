const PIXI = require('pixi.js')

class Character {
  constructor(conf) {
    if (!conf.engine) {
      throw new Error('Engine must be specified in character config')
    }
    this.engine = conf.engine
    this.conf = conf
    this.create()
    this.reversed = false
  }

  create() {
    PIXI.loader.add(this.conf.name, this.conf.sprites[0])
      .load((loader, res) => {
        console.debug("Creating character:", this.conf)

        this.sprites = this.conf.sprites.map((i) => { return PIXI.Texture.fromImage(i) })
        this.spriteIdx = 0

        this.char = new PIXI.Sprite(this.sprites[0])

        this.char.width = 200
        this.char.height = 132
        this.char.x = (this.engine.renderer.width / 2)
        this.char.y = (this.engine.renderer.height / 2)
        this.char.anchor.set(0.5, 0.5)
        this.char.interactive = true
        this.char.buttonMode = true
        this.char.defaultCursor = 'pointer'

        this.engine.stage.addChild(this.char)

        this.engine.ticker.add(this.update.bind(this))

        this.engine.view.onclick = () => {
          this.move(10, 10)
        }
      })
  }

  moveTo(x, y, dur) {
    dur = dur || 1000
    let path = new PIXI.tween.TweenPath()
    path.moveTo(this.char.x, this.char.y)
      .arcTo(this.char.x, this.char.y, x, y, 50)

    let tween = PIXI.tweenManager.createTween(this.char)
    tween.path = path
    tween.time = dur || 1000
    tween.easing = PIXI.tween.Easing.outBounce()
    tween.start()

    let grph = new PIXI.Graphics()
    grph.lineStyle(1, 0xff0000, 1)
    grph.drawPath(path)
    this.engine.stage.addChild(grph)
  }

  move(x, y, dur) {
    this.moveTo(this.char.x + x, this.char.y + y, dur)
  }

  pos() {
    return {
      x: this.char.x,
      y: this.char.y,
    }
  }

  update(delta) {
    let thresh = 0.2

    this.char.rotation += 0.01 * (this.reversed ? -1 : 1)

    this.char.texture = this.sprites[parseInt(++this.spriteIdx % this.sprites.length)]

    if (!this.reversed && this.char.rotation > thresh) {
      this.reversed = true
    } else if (this.reversed && this.char.rotation < -thresh) {
      this.reversed = false
    }

    PIXI.tweenManager.update()
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
