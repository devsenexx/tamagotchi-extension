import React from "react"
import ReactDOM from "react-dom"
import { ContentScriptApp } from "./components/apps/ContentScriptApp"
import { FRAME_ID } from "./lib/consts"
import "./lib/pet_hooks"
import { wake } from "./lib/tick"

// chrome.runtime.onSuspend.addListener(doDestroy)

async function main() {
  wake()
  const { popout } = await chrome.storage.local.get("popout")
  await chrome.storage.local.set({ docWidth: document.body.clientWidth })

  console.log("PlayPet popout", popout)
  if (popout) {
    doInject()
  }
}

function doInject() {
  console.trace("Injecting PlayPet Frame")
  const root = document.createElement("div")
  root.id = FRAME_ID
  document.body.appendChild(root)
  ReactDOM.render(<ContentScriptApp />, root)
}

function getFrameEl(): HTMLDivElement | undefined {
  return document.getElementById(FRAME_ID) as HTMLDivElement
}

function doDestroy() {
  console.trace("Destroying PlayPet Frame")
  const root = getFrameEl()
  document.body.removeChild(root)
}

chrome.runtime.onMessage.addListener(async ({ action }) => {
  // console.log("cs message", { action })
  if (action === "create" && !getFrameEl()) {
    doInject()
  } else if (action === "destroy" && getFrameEl()) {
    doDestroy()
  }
})

main()
