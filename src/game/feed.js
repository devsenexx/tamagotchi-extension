const FOODS = require('../utils/extension.js')
  .FOOD_URLS;
let KeyStorage = require('../utils/key_storage.js')
let Action = require('../models/action.js')
const FOOD_WALL_THRESH = 100

class Feed {
  constructor(target, scatter = false) {
    this.target = target
    this.scatter = scatter
    this.foods = []
    this.walkDest = []
    this.spriteIdx = []
    this.sprites = []
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

    Object.keys(FOODS)
      .forEach((foodName, i) => {
        this.sprites[i] = FOODS[foodName].map((s) => { return new PIXI.Texture.fromImage(s) })
        let food = new PIXI.Sprite(this.sprites[i][0])
        this.spriteIdx.push(0)
        food.x = this.target.engine.renderer.width - (100 * i)
        food.y = 100
        food.width = 100
        food.height = 73
        food.anchor.set(0.5, 0.5)
        food.interactive = true
        food.buttonMode = true
        food.defaultCursor = 'pointer'

        // this.target.engine.ticker.add(() => {
        //   food.texture = this.sprites[i][parseInt(++this.spriteIdx[i] % this.sprites.length)]
        // });

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
          setTimeout(() => {
            food.destroy()
          }, 2000)

          //send notification to server
          let action = new Action()
          action.addAction(this.scatter ? "game" : "feed", action.getUserName(), action.getPictureSrc())

          tween.start()
          this.clearTable()
          if (!this.scatter) {
              setTimeout(() => {
                  let sentences = [
                      "Burrrppp!",
                      "That tasted great!",
                      "Aaah, that was yummy!",
                      // "I'm gonna be sick!"
                  ]
                  this.target.speak(sentences[Math.floor(Math.random() * sentences.length)])
              }, 2000)
          } else {
            setTimeout(() => {
              let sentences = [
                "That was fun!",
                "You're really good at this!"
              ]
              this.target.speak(sentences[Math.floor(Math.random() * sentences.length)])
            }, 2000)
          }

          if (!KeyStorage.get('food-tween')) {
            this.target.engine.ticker.add(function () {
              PIXI.tweenManager.update()
            })
            KeyStorage.set('food-tween', true)
          }
        })

        this.target.engine.stage.addChild(food)
        this.foods.push(food)
      })

    if (this.foods.length) {
      this.target.engine.ticker.add(() => {
        if (this.foods && this.foods.length) {
          this.foods.forEach((food, idx) => {
            if (food && food.texture) {
              food.texture = this.sprites[idx][parseInt(++this.spriteIdx[idx] % this.sprites[idx].length)]
            }
          })
        }
      })
    }

    if (this.scatter && this.foods.length) {
      let messFunc = (delta) => {
        if (this.foods.length) {
          delta = delta || 1
          this.foods.forEach((food) => {
            let path = new PIXI.tween.TweenPath(),
              x = Math.floor(Math.random() * this.target.engine.renderer.width - FOOD_WALL_THRESH) + FOOD_WALL_THRESH

            path.moveTo(food.x, food.y)
            path.lineTo(x, food.y)

            let scaleX = x > food.x ? -1 : 1
            food.scale.x *= scaleX
            // path.arcTo(food.x, food.y, this.target.char.x, this.target.char.y, 100)
            let tween = PIXI.tweenManager.createTween(food)
            tween.path = path
            tween.time = 1200
            tween.expire = true
            // tween.easing = PIXI.tween.Easing.inOutElastic()
            tween.easing = PIXI.tween.Easing.linear()
            setTimeout(() => {
              tween.start()
            }, 100)
          })
        }
      }
      setInterval(messFunc.bind(this), 1300)
      messFunc()
    }
  }

  clearTable() {
    if (this.foods.length) {
      this.foods.forEach((i) => {
        this.target.engine.ticker.add(() => {
          i.alpha -= 0.01
          if (i.alpha == 0) {
            if (this.foodInterval) {
              cancelInterval(this.foodInterval)
            }
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
