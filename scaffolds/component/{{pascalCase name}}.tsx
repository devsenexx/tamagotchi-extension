import React from "react"
import Box from "@mui/material/Box"
import { BaseProps } from "../lib/types"

export interface {{ pascalCase name }}Props extends BaseProps {
  //
}

export const {{ pascalCase name }}: React.FC<{{ pascalCase name }}Props> = () => {
  return (
    <Box>
      {{ pascalCase name }}
    </Box>
  )
}
