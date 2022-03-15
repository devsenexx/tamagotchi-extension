import React from "react"
import ReactDOM from "react-dom"
import { PopupApp } from "./components/apps/PopupApp"
import { wake } from "./lib/tick"

document.addEventListener("DOMContentLoaded", async () => {
  wake()
  console.log("popup open")
  ReactDOM.render(<PopupApp />, document.getElementById("root"))
})
