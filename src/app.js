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
        if (request.data && request.data.name == "feed") {
            alert("fed")
            console.log(request.data)
        }
    }
)






//console.log(getUserName())
//console.log(getPictureSrc())