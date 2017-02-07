let engine = require('./game/engine.js')
let Character = require('./game/character.js')
let Action = require('./models/action.js')

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {
    data: {
      user_id,
      pic
    }
  } = request || {}

  if (user_id && user_id != new Action().getUserName()) {
    console.log("Received feed action", request.data)
    let texts, text

    switch (request.data.name) {
      case 'feed':
        texts = [
          `${user_id} just fed me, he's nice...`,
          `I just had the most delicious turd...\nPrepared by ${user_id}!`,
          `I think I'm getting gassy after dinner with ${user_id}`,
        ]
        text = texts[Math.floor(Math.random() * texts.length)]
        break;
      case 'game':
        texts = [
          `Me and ${user_id} just beat them at their own game!`,
          `${user_id} has magic fingers ;)`,
          `${user_id} and I crushed it! They didn't have a chance!`,
        ]
        text = texts[Math.floor(Math.random() * texts.length)]
        break;
    }

    bat.sayWithPic(text, pic)
  }
})
