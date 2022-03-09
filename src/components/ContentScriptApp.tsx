import React from "react"
import { withTick } from "../lib/tick"
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline"
import { ContentScriptHome } from "./ContentScriptHome"

export const ContentScriptApp: React.FC = withTick(({ frame, delta }) => {
  return (
    <ScopedCssBaseline style={{ backgroundColor: "transparent" }}>
      <ContentScriptHome />
    </ScopedCssBaseline>
  )
})
