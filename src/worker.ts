import { TICK_TIMEOUT } from "./lib/consts"
import { getPet, savePet } from "./pet_utils"

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!")
})

chrome.alarms.create({ when: Date.now() + TICK_TIMEOUT })

async function doTick() {
  const pet = await getPet()
  pet.tick()
  savePet(pet)
}

chrome.alarms.onAlarm.addListener(() => {
  console.log("tick")
  doTick()
  chrome.alarms.create({ when: Date.now() + TICK_TIMEOUT })
})
