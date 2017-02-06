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

let User = require('./models/user.js')
let user = new User("eran@senexx.com")


//let Action = require('./models/action.js')
//let action = new Action().addAction("bla",user.id)

function getUserName() {
  var metas = document.getElementsByTagName('META');

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute("name") == "user-login") {
      return metas[i].getAttribute("content");
    }
  }

  return "";
}

function getPictureSrc() {
  try {
    return document.getElementsByClassName("avatar")[0].src
  } catch (e) {
    // console.error(e)
  }
}
console.log(getUserName())
console.log(getPictureSrc())
