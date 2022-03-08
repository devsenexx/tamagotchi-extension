import { TICK_TIMEOUT } from "./lib/consts"
import { getPet, savePet } from "./pet_utils"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed!")
  const pet = await getPet({ sync: true })
  await savePet(pet, { sync: false })
})

chrome.alarms.create("tick", { when: Date.now() + TICK_TIMEOUT * 2, periodInMinutes: 0.01 / 3 })
chrome.alarms.create("save", { when: Date.now() + TICK_TIMEOUT * 2, periodInMinutes: 1 })

async function doTick() {
  const pet = await getPet({ sync: false })
  if (!pet) {
    return
  }
  pet.tick()
  await savePet(pet, { sync: false })
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  switch (alarm.name) {
    case "tick":
      console.log("tick")
      await doTick()
      break
    case "save":
      const pet = await getPet({ sync: false })
      if (!pet) {
        return
      }
      console.log("saving to sync")
      await savePet(pet, { sync: true })
      break
  }
})
