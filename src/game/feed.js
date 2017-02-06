const FOODS = require('../utils/extension.js')
  .FOOD_URLS;
let KeyStorage = require('../utils/key_storage.js')
let Action = require('../models/action.js')

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
        food.width = 100
        food.height = 100
        food.anchor.set(0.5, 0.5)
        food.interactive = true
        food.buttonMode = true
        food.defaultCursor = 'pointer'

        food.on('click', () => {
          let path = new PIXI.tween.TweenPath()
          path.moveTo(food.x, food.y)
          path.lineTo(this.target.char.x, this.target.char.y)
          // path.arcTo(food.x, food.y, this.target.char.x, this.target.char.y, 100)
          let tween = PIXI.tweenManager.createTween(food)
          tween.path = path
          tween.time = 1000
          tween.expire = true
          tween.easing = PIXI.tween.Easing.outExpo()
          tween.start()
          setTimeout(() => { food.destroy() }, 2000)

          //send notification to server
          let action = new Action()
          action.addAction("feed",action.getUserName(),action.getPictureSrc())

          // tween.easing = PIXI.tween.Easing.linear()
          // let dPath = new PIXI.Graphics();
          // dPath.lineStyle(1, 0xff0000, 1);
          // dPath.drawPath(path);
          // this.target.engine.stage.addChild(dPath);
          tween.start()
          this.clearTable()
          setTimeout(() => {
            let sentences = [
              "burrrrp",
              "That tasted funky",
              "Aaah, that was yummy",
              "I'm gonna be sick!"
            ]
            this.target.speak(sentences[Math.floor(Math.random() * sentences.length)])
          })

          if (!KeyStorage.get('food-tween')) {
            this.target.engine.ticker.add(function () {
              PIXI.tweenManager.update()
            })
            KeyStorage.set('food-tween', true)
          }
        })

        this.target.engine.stage.addChild(food)
        this.foods.push(food)
        i++
      })
  }

  clearTable() {
    if (this.foods.length) {
      this.foods.forEach((i) => {
        this.target.engine.ticker.add(() => {
          i.alpha -= 0.01
          if (i.alpha == 0) {
            i.destroy()
          }
        })
      })
      this.foods = []
      this.target.engine.ticker.remove(function () {
        PIXI.tweenManager.update()
      })
      KeyStorage.set('food-tween', false)
    }
  }
}

module.exports = Feed
