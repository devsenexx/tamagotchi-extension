module.exports = {
  SPEECH_BUBBLE_URL: chrome.extension.getURL('assets/img/speech.png'),
  ICON_URLS: (function () {
    mapped = Object.create(null);
    ['me-go-sleep', 'feed-me', 'im-bored', 'kishta'].forEach((i) => {
      mapped[i] = chrome.extension.getURL('assets/img/menu/' + i + '.png')
    })
    return mapped
  })(),
  backAndPostToken: {
    method: 'POST',
    headers: {
      "AnonymousToken": "40e85296-b312-4a8f-b9c7-a69f5fa9eb51"
    },
  }
}
