class KeyStorage {
  constructor() {
    this.storage = Object.create(null)
  }

  get(k) {
    return this.storage[k]
  }

  set(k, val) {
    return this.storage[k] = val
  }
}
window.__TG = window.__TG || {}
window.__TG.keyStorage = window.__TG.keyStorage || new KeyStorage()

module.exports = window.__TG.keyStorage
