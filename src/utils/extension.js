module.exports = {
  SPEECH_BUBBLE_URL: chrome.extension.getURL('assets/img/speech.png'),
  HEART_URL: chrome.extension.getURL('assets/img/heart.png'),
  ICON_URLS: (function () {
    mapped = Object.create(null);
    ['me-go-sleep', 'feed-me', 'im-bored', 'kishta'].forEach((i) => {
      mapped[i] = chrome.extension.getURL('assets/img/menu/' + i + '.png')
    })
    return mapped
  })(),
  FOOD_URLS: (function() {
    mapped = Object.create(null)
    counts = {
      enemy13: 12,
      enemy4: 8,
    }

    for (enemy in counts) {
      mapped[enemy] = [...Array(counts[enemy]).keys()].map((i) => {
        return chrome.extension.getURL('assets/img/sprites/' + enemy + '-Idle_' + i + '.png')
      })
    }
    return mapped
  })(),
  backAndPostToken: {
    method: 'POST',
    headers: {
      "AnonymousToken": "40e85296-b312-4a8f-b9c7-a69f5fa9eb51"
    },
  }
}
