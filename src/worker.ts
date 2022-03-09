import {
  MOVE_PERIOD,
  MOVE_PERIOD_MINS,
  POPOUT_FRAME_SIZE,
  SAVE_PERIOD,
  SAVE_PERIOD_MINS,
  TICK_TIMEOUT,
  TIMEOUT_IN_MINS,
} from "./lib/consts"
import PetData from "./pet_data"
import { getPet, savePet } from "./pet_utils"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension installed!")
  const pet = await getPet({ sync: true })
  await savePet(pet, { sync: false })
})

chrome.alarms.create("tick", {
  when: Date.now(),
  periodInMinutes: TIMEOUT_IN_MINS,
})

chrome.alarms.create("lifecycle-tick", {
  when: Date.now(),
  periodInMinutes: TIMEOUT_IN_MINS / 4,
})

let timeToMove = MOVE_PERIOD
let timeToSave = SAVE_PERIOD
function handleResp() {
  if (chrome.runtime.lastError) {
    // console.warn(chrome.runtime.lastError)
  }
}

const handleAlarms = async (alarm: chrome.alarms.Alarm): Promise<void> => {
  switch (alarm.name) {
    case "tick":
      tick()
      break

    case "lifecycle-tick":
      lifecycle()
      break
  }
}

async function tick() {
  const pet = await getPet({ sync: false })
  const { popout } = await chrome.storage.local.get("popout")
  timeToMove -= TICK_TIMEOUT
  timeToSave -= TICK_TIMEOUT
  console.log("tick", { timeToMove, timeToSave, curPet: pet, popout })
  let moved = false
  let saved = false

  if (!pet) {
    if (!popout) {
      timeToMove -= MOVE_PERIOD
      timeToSave -= SAVE_PERIOD
    }
    return
  }

  const activeTabs = await chrome.tabs.query({
    active: true,
    discarded: false,
    currentWindow: true,
  })
  const inactiveTabs = await chrome.tabs.query({
    active: false,
    discarded: false,
  })

  // console.log("tabs", tabs)

  pet.tick()

  if (timeToMove <= 0 && popout) {
    if (!pet.isDoingSomething) {
      await pet.moveRandomly(POPOUT_FRAME_SIZE)
      timeToMove = MOVE_PERIOD
      moved = true
    }
  }

  if (timeToSave <= 0) {
    console.log("Saving", pet)
    savePet(pet, { sync: true })
    timeToSave = SAVE_PERIOD
    saved = true
  }

  await savePet(pet, { sync: false })

  for (const tab of inactiveTabs) {
    chrome.tabs.sendMessage(tab.id, { action: "destroy" }, handleResp)
  }

  for (const tab of activeTabs) {
    chrome.tabs.sendMessage(tab.id, { action: "tick", payload: pet.toJSON() }, handleResp)

    if (moved) {
      chrome.tabs.sendMessage(tab.id, { action: "move", payload: pet.toJSON() }, handleResp)
    }
    if (saved) {
      chrome.tabs.sendMessage(tab.id, { action: "save", payload: pet.toJSON() }, handleResp)
    }
  }
}

async function lifecycle() {
  // const activeTabs = await chrome.tabs.query({ active: true, discarded: false })
  const inactiveTabs = await chrome.tabs.query({
    active: false,
    discarded: false,
  })

  for (const tab of inactiveTabs) {
    chrome.tabs.sendMessage(tab.id, { action: "destroy" }, handleResp)
  }
}

chrome.alarms.onAlarm.addListener(handleAlarms)
