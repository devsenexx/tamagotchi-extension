import React from "react"
import ReactDOM from "react-dom"
import { OptionsApp } from "./components/OptionsApp"
import { wake } from "./lib/tick"

document.addEventListener("DOMContentLoaded", async () => {
  wake()
  console.log("options")
  ReactDOM.render(<OptionsApp />, document.getElementById("root"))
})
