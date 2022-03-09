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
  when: Date.now() + TICK_TIMEOUT,
  periodInMinutes: TIMEOUT_IN_MINS,
})

let timeToMove = MOVE_PERIOD
let timeToSave = SAVE_PERIOD

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const curPet = await getPet({ sync: false })
  const { popout } = await chrome.storage.local.get("popout")
  timeToMove -= TICK_TIMEOUT
  timeToSave -= TICK_TIMEOUT
  console.log("tick", { timeToMove, timeToSave, curPet, popout })
  let moved = false
  let saved = false

  if (!curPet) {
    if (!popout) {
      timeToMove -= MOVE_PERIOD
      timeToSave -= SAVE_PERIOD
    }
    return
  }

  const tabs = await chrome.tabs.query({ discarded: false })
  console.log("tabs", tabs)

  curPet.tick()

  if (timeToMove <= 0 && popout) {
    await curPet.moveRandomly(POPOUT_FRAME_SIZE)
    timeToMove = MOVE_PERIOD
    moved = true
  }

  if (timeToSave <= 0) {
    console.log("Saving", curPet)
    savePet(curPet, { sync: true })
    timeToSave = SAVE_PERIOD
    saved = true
  }

  await savePet(curPet, { sync: false })

  for (const tab of tabs) {
    chrome.tabs.sendMessage(tab.id, { action: "tick", payload: curPet.toJSON() }, () => {
      if (chrome.runtime.lastError) {
        // console.warn(chrome.runtime.lastError)
      }
    })
    if (moved) {
      chrome.tabs.sendMessage(tab.id, { action: "move", payload: curPet.toJSON() }, () => {
        if (chrome.runtime.lastError) {
          // console.warn(chrome.runtime.lastError)
        }
      })
    }
    if (saved) {
      chrome.tabs.sendMessage(tab.id, { action: "save", payload: curPet.toJSON() }, () => {
        if (chrome.runtime.lastError) {
          // console.warn(chrome.runtime.lastError)
        }
      })
    }
  }
})
