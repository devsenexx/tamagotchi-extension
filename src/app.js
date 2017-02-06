let engine = require('./game/engine.js')
let Character = require('./game/character.js')

// TODO: move this to centralized file with other assets
let bat = new Character({
  engine,
  name: 'bat',
  sprites: [...Array(8)
    .keys()
  ].map((i) => {
    return chrome.extension.getURL('assets/img/sprites/enemy6-Idle_' + i + '.png')
  })
})

//let User = require('./models/user.js')
//let user = new User("eran@senexx.com")

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        const {
            data: {
                user_id,
                pic
            }
        } = request || {}

        if (user_id && user_id != getUserName()) {
            console.log("Received feed action", request.data)
            bat.feed(pic, user_id)
        }
    }
)


function getPictureSrc() {
  try {
    return document.getElementsByClassName("avatar")[0].src
  } catch (e) {
    // console.error(e)
  }
}
console.log(getUserName())
console.log(getPictureSrc())
