backAndPostToken = require('./../utils/extension.js').backAndPostToken

class Action {
    addAction(actionName,userName,picSrc) {
        //API request


        chrome.runtime.sendMessage({
            url: 'http://13.67.227.91:8080/action',
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
            function(request, sender, sendResponse) {
                if (request.data) {
                    console.log(request.data)
                }
            }
        )
    };

    constructor() {

    };
}
module.exports = Action