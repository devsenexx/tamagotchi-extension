import React from "react"
import ReactDOM from "react-dom"
import { ContentScriptApp } from "./components/ContentScriptApp"
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
  root.id = "__playpet__frame__"
  // root.style.position = "fixed"
  // root.style.top = "0"
  // root.style.right = "0"
  // root.style.transition = "all 500ms linear"
  document.body.appendChild(root)
  ReactDOM.render(<ContentScriptApp />, root)
}

function doDestroy() {
  console.log("Content script playpet: destroy")
  const root = document.getElementById("__playpet__frame__")
  document.body.removeChild(root)
}

chrome.runtime.onMessage.addListener(async ({ action, payload }) => {
  if (action === "popout") {
    if (payload) {
      doInject()
    } else {
      doDestroy()
    }
  }
})

main()
