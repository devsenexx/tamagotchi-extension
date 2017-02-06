let engine = require('./game/engine.js')
let Character = require('./game/character.js')

// TODO: move this to centralized file with other assets
let bat = new Character({
  engine,
  name: 'bat',
  sprites: [...Array(8)
    .keys()
  ].map((i) => {
    return chrome.extension.getURL('assets/img/enemy6-Idle_' + i + '.png')
  })
})

// Hirsch

// require("./authentication/api")
//
// // var script = document.createElement("script");
// // script.setAttribute("src", "https://apis.google.com/js/api.js?onload=onLoadCallback");
// // script.type = 'text/javascript';
// // document.head.appendChild(script);
//
// // promise that would be resolved when gapi would be loaded
// const gapiPromise = (function(){
//     return new Promise(function(resolve, reject) {
//         window.onLoadCallback = function() {
//           resolve(gapi)
//         }
//     })
// }());
//
// var authInited = gapiPromise.then(function(){
//     gapi.auth2.init({
//         client_id: 'filler_text_for_client_id.apps.googleusercontent.com'
//     });
// })
//
//
// authInited.then(function() {
//   // will be executed after gapi is loaded, and gapi.auth2.init was called
// });
//
// window.gapi = gapi
// const GoogleAuth = require("./authentication/google_auth")
// const google_auth = new GoogleAuth("people/me")


// Katoni
let Pusher = require('pusher-client');
let pusher = new Pusher('c1cd6b4a6f1f795b00ec',{
  encrypted: true
});
Pusher.logToConsole = true;

let channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
  console.log(data.message);
});

let User = require('./models/user.js')
let user = new User("eran@senexx.com")

//let Action = require('./models/action.js')
//let action = new Action().addAction("bla",user.id)

