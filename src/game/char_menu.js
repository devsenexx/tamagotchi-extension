const CONSTS = require('../utils/extension.js')
let Feed = require('./feed.js');

class CharMenu {
  constructor(target) {
    this.target = target
    this.buttons = []
  }

  redrawMenuItems(drop = true) {
    if (this.menuTimeout) {
      clearTimeout(this.menuTimeout)
    }

    this.buttons = []
    this.buttons.push(this.drawMenuItem('me-go-sleep', -150, 30))
    this.buttons.push(this.drawMenuItem('feed-me', -150, -90, () => {
      new Feed(this.target)
    }))
    this.buttons.push(this.drawMenuItem('im-bored', -160, -30))
    this.buttons.push(this.drawMenuItem('kishta', 80, -30))

    if (drop) {
      this.menuTimeout = setTimeout(() => {
        this.clearMenuItems()
      }, 6000)
    }
  }

  clearMenuItems() {
    this.buttons.forEach((btn) => {
      btn.destroy()
    })
    this.buttons = []
  }

  drawMenuItem(icon, x, y, click) {
    let btn = new PIXI.Sprite.fromImage(CONSTS.ICON_URLS[icon]),
      btnX = this.target.char.x + x,
      btnY = this.target.char.y + y

    btn.interactive = true
    btn.buttonMode = true
    btn.defaultCursor = 'pointer'
    btn.x = btnX
    btn.y = btnY

    this.target.engine.stage.addChild(btn)

    if (click) {
      btn.on('click', click.bind(this))
    }

    this.target.engine.ticker.add(() => {
      if (btn && btn.transform) {
        btn.x = this.target.char.x + x
      }
    })

    return btn
  }

  toggle() {
    this.buttons.length > 0 ? this.clearMenuItems() : this.redrawMenuItems()
  }
}

module.exports = CharMenu
