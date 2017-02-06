class CharMenu {
  constructor(target) {
    this.target = target
    this.buttons = []
  }

  redrawMenuItems() {
    this.buttons = []
    this.buttons.push(this.drawMenuItem('Bed', -150, 50))
    this.buttons.push(this.drawMenuItem('Feed', -150, -50, () => { this.target.speak('Yum!') }))
    this.buttons.push(this.drawMenuItem('Play', -160, 0))
    this.buttons.push(this.drawMenuItem('Leave', 160, 0))
  }

  clearMenuItems() {
    this.buttons.forEach((btn) => {
      btn.destroy()
    })
    this.buttons = []
  }

  drawMenuItem(text, x, y, click) {
    let btn = new PIXI.Graphics(),
      txt  = new PIXI.Text(text, { fill: 0x333333, fontSize: 22, align: 'center', fontFamily: 'Press Start 2P' }),
      btnX = this.target.char.x + x,
      btnY = this.target.char.y + y

    btn
      .beginFill(0x9DAAB1, 0.9)
      .drawCircle(btnX - 3, btnY - 3, 32)
      .endFill()
      .beginFill(0xCCE5E8, 0.9)
      .drawCircle(btnX, btnY, 32)
      .endFill()

    btn.interactive = true
    btn.buttonMode = true
    btn.defaultCursor = 'pointer'

    txt.setTransform(btnX - 25, btnY - 13)

    btn.addChild(txt)
    this.target.engine.stage.addChild(btn)

    if (click) {
      btn.on('click', click.bind(this))
    }

    return btn
  }

  toggle() {
    this.buttons.length > 0 ? this.clearMenuItems() : this.redrawMenuItems()
  }
}

module.exports = CharMenu
