import React from "react"
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline"
import { ContentScriptHome } from "../pages/ContentScriptHome"

export const ContentScriptApp: React.FC = () => {
  return (
    <ScopedCssBaseline style={{ backgroundColor: "transparent" }}>
      <ContentScriptHome />
    </ScopedCssBaseline>
  )
}
