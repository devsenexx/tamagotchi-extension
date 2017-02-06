const PIXI = require('pixi.js')
const CharMenu = require('./char_menu.js')
const CONSTS = require('../utils/extension.js')

WALK_THRESH = 100
WALK_MAX_WALL_DISTANCE = 200

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
    this.sprites = this.conf.sprites.map((i) => {
      return PIXI.Texture.fromImage(i)
    })

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

    this.menu = new CharMenu(this)

    this.engine.stage.addChild(this.char)

    this.engine.ticker.add(this.update.bind(this))

    this.char.on('click', () => {
      this.menu.toggle()
    })
  }

  moveTo(x, y, dur) {
    dur = dur || 1000
    let path = new PIXI.tween.TweenPath()
    tween = PIXI.tweenManager.createTween(this.char)

    path.moveTo(this.char.x, this.char.y)
      .arcTo(this.char.x, this.char.y, x, y, 50)

    tween.path = path
    tween.time = dur
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

    this.walkAround()

    PIXI.tweenManager.update()
  }

  speak(text, timeout = 4000) {
    if (this.bubbleTimeout) {
      this.bubble.destroy()
      clearTimeout(this.bubbleTimeout)
    }

    this.bubble = new PIXI.Sprite.fromImage(CONSTS.SPEECH_BUBBLE_URL)
    this.bubble.anchor.set(0.5, 1)
    this.bubble.height = 91
    this.bubble.width = 262
    this.bubble.x = this.char.x - 100
    this.bubble.y = this.char.y
    this.bubble.interactive = true
    this.bubble.buttonMode = true
    this.bubble.defaultCursor = 'pointer'
    this.bubble.on('click', () => {
      this.bubble.destroy()
    })
    this.engine.stage.addChild(this.bubble)

    let txt = new PIXI.Text(text, {
      fill: 0x333333,
      fontSize: 60,
      align: 'center',
      fontFamily: 'Courier New'
    })
    txt.setTransform(-80, -180)
    this.bubble.addChild(txt)

    this.engine.ticker.add(() => {
      if (this.bubble && this.bubble.transform) {
        this.bubble.x = this.char.x - 100
      }
    })

    this.bubbleTimeout = setTimeout(() => {
      this.bubble.destroy()
    }, timeout)
  }

    feed(pic, name, timeout = 4000) {
        if (this.bubbleTimeout) {
            this.bubble.destroy()
            clearTimeout(this.bubbleTimeout)
        }

        const img = new PIXI.Sprite.fromImage(pic)
        img.anchor.set(0.5, 1)
        img.height = 91
        img.width = 91
        img.x = this.char.x - 100
        img.y = this.char.y
        img.interactive = true
        img.buttonMode = true
        img.defaultCursor = 'pointer'

        const texts = [
          `${name} just fed me, he's nice...`,
          `I just had the most delicious turd...\n Prepared by ${name}!`,
          `I think I'm getting gasy after dinner with ${name}`,
        ]
        const text = texts[Math.floor(Math.random() * texts.length)]
        let txt = new PIXI.Text(text, {
            fill: 0x333333,
            fontSize: 60,
            align: 'center',
            fontFamily: 'Courier New'
        })

        txt.setTransform(-80, -180)

        this.bubble = new PIXI.Sprite.fromImage(CONSTS.SPEECH_BUBBLE_URL)
        this.bubble.anchor.set(0.5, 1)
        this.bubble.height = 91
        this.bubble.width = 262
        this.bubble.x = this.char.x - 100
        this.bubble.y = this.char.y
        this.bubble.interactive = true
        this.bubble.buttonMode = true
        this.bubble.defaultCursor = 'pointer'
        this.bubble.on('click', () => {
            img.destroy()
            txt.destroy()
            this.bubble.destroy()
        })

        this.bubble.addChild(txt)
        this.bubble.addChild(img)
        this.engine.stage.addChild(this.bubble)

        this.engine.ticker.add(() => {
            if (this.bubble && this.bubble.transform) {
                this.bubble.x = this.char.x - 100
            }
        })

        this.bubbleTimeout = setTimeout(() => {
            this.bubble.destroy()
        }, timeout)
    }

  walkAround() {
    if (this.char.x == this.walkDest ||
      this.char.x < WALK_MAX_WALL_DISTANCE ||
      this.char.x > this.engine.renderer.width - WALK_MAX_WALL_DISTANCE) {

      this.walkDest = null
    } else {
      this.char.x += this.char.x > this.walkDest ? -1 : 1
    }

    if (!this.walkDest) {
      this.walkDest = this.char.x + (Math.floor(Math.random() * WALK_THRESH * 2) - WALK_THRESH)
    }
  }
}

module.exports = Character
