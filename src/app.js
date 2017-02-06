let engine = require('./game/engine.js')
let Character = require('./game/character.js')
let bat = new Character({ engine: engine, name: 'bat', asset: chrome.extension.getURL('assets/img/bat-stasis.png') })
