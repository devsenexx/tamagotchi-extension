backAndPostToken = require('./../utils/extension.js').backAndPostToken

class Action {
    addAction(actionName,userId) {
        //API request

        console.log(userId)
        //chrome.runtime.sendMessage({
        //    url: 'https://api.backand.com/1/objects/actions',
        //    args: {
        //        method: 'POST',
        //        headers: {"AnonymousToken": "40e85296-b312-4a8f-b9c7-a69f5fa9eb51"},
        //        body: JSON.stringify({
        //            name: "eat",
        //            user: 1,
        //            date: new Date()
        //        })
        //    }
        //});

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