function sendRequest(origin_tab, url, args) {
    fetch(url, args)
    .then(function(response) {
        console.log(response)
        response.json().then(function(json) {
            console.log(json)
            chrome.tabs.sendMessage(origin_tab.id, {data: json})
        })
    })
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.url) {
            sendRequest(sender.tab, request.url, request.args)
        }
    }
)