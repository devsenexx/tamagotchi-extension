import React from "react"
import ReactDOM from "react-dom"
import { PopupApp } from "./components/PopupApp"

document.addEventListener("DOMContentLoaded", async () => {
  console.log("popup open")
  ReactDOM.render(<PopupApp />, document.getElementById("root"))
})
