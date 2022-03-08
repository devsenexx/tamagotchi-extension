import React from "react"
import { withTick } from "../lib/tick"
import CssBaseline from "@mui/material/CssBaseline"
import { PopupHome } from "./PopupHome"

export const PopupApp: React.FC = withTick(({ frame, delta }) => {
  return (
    <div>
      <CssBaseline />
      <PopupHome />
    </div>
  )
})
