backAndPostToken = require('./../utils/extension.js')
  .backAndPostToken

class Action {
  addAction(actionName, userName, picSrc) {
    //API request

    console.log("send_food")
    chrome.runtime.sendMessage({
      url: 'https://tamagotchi-backend.senexx.com/action',
      args: {
        method: 'POST',
        body: JSON.stringify({
          name: actionName,
          user_id: userName,
          pic: picSrc
        }),
        contentType: 'application/json'
      }
    });

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        if (request.data) {
          console.log(request.data)
        }
      }
    )
  };


  getUserName() {
    var metas = document.getElementsByTagName('META');

    for (var i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute("name") == "user-login") {
        return metas[i].getAttribute("content");
      }
    }

    return "";
  }

  getPictureSrc() {
    return document.getElementsByClassName("avatar")[0].src
  }

  constructor() {

  };
}
module.exports = Action
