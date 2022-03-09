import React from "react"
import ReactDOM from "react-dom"
import { ContentScriptApp } from "./components/ContentScriptApp"
import { FRAME_ID } from "./lib/consts"
import "./lib/pet_hooks"

// chrome.runtime.onSuspend.addListener(doDestroy)

async function main() {
  const { popout } = await chrome.storage.local.get("popout")
  await chrome.storage.local.set({ docWidth: document.body.clientWidth })

  console.log("PlayPet popout", popout)
  if (popout) {
    doInject()
  }
}

function doInject() {
  console.log("Content script playpet")
  const root = document.createElement("div")
  root.id = FRAME_ID
  document.body.appendChild(root)
  ReactDOM.render(<ContentScriptApp />, root)
}

function getFrameEl(): HTMLDivElement | undefined {
  return document.getElementById(FRAME_ID) as HTMLDivElement
}

function doDestroy() {
  console.log("Content script playpet: destroy")
  const root = getFrameEl()
  document.body.removeChild(root)
}

chrome.runtime.onMessage.addListener(async ({ action, payload }) => {
  if (action === "tick" && !getFrameEl()) {
    if (payload) {
      doInject()
    }
  } else if (action === "destroy" && getFrameEl()) {
    doDestroy()
  }
})

main()
