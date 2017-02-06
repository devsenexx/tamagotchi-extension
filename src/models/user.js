backAndPostToken = require('./../utils/extension.js').backAndPostToken

class User {
    getUserByEmail(emailAddress) {
        //API request
        chrome.runtime.sendMessage({
            url: 'https://api.backand.com/1/query/data/getUserByEmail?parameters=%7B%22emailAddress%22:%22\''+emailAddress+'\'%22%7D',
            args: backAndPostToken
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
module.exports = User