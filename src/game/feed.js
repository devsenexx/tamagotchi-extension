const FOODS = require('../utils/extension.js')
  .FOOD_URLS;
let KeyStorage = require('../utils/key_storage.js')

class Feed {
  constructor(target) {
    this.target = target
    this.foods = []
    this.drawFoods()
  }

  drawFoods() {
    if (this.foods.length) {
      Object.values(this.foods)
        .forEach((i) => {
          i.destroy()
        })
      this.foods = []
    }

    let i = 1
    Object.keys(FOODS)
      .forEach((foodName) => {
        let sprites = FOODS[foodName]
        let food = new PIXI.Sprite.fromImage(sprites[0])
        food.x = this.target.engine.renderer.width - (100 * i)
        food.y = 50
        // food.scale = 0.5
        food.width = 100
        food.height = 100
        food.interactive = true
        food.buttonMode = true
        food.defaultCursor = 'pointer'

        food.on('click', () => {
          let path = new PIXI.tween.TweenPath()
          path.moveTo(food.x, food.y)
          path.arcTo(food.x, food.y, this.target.char.x, this.target.char.y)
          let tween = PIXI.tweenManager.createTween(food)
          tween.path = path
          tween.time = 2000
          tween.expire = true
          tween.easing = PIXI.tween.Easing.outExpo()
          tween.start()
          setTimeout(() => { food.destroy() }, 2000)
        })

        if (!KeyStorage.get('food-tween')) {
          this.target.engine.ticker.add(() => {
            PIXI.tweenManager.update()
          })
        }

        KeyStorage.set('food-tween', true)

        this.target.engine.stage.addChild(food)
        this.foods[foodName] = food
        i++
      })
  }

  eatFood() {

  }
}

module.exports = Feed
