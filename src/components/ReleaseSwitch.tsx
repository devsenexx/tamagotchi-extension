import React from "react"
import Box from "@mui/material/Box"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import { useStorageKey } from "../lib/use_storage"
import { BaseProps } from "../lib/types"

export interface ReleaseSwitchProps extends BaseProps {
  //
}

export const ReleaseSwitch: React.FC<ReleaseSwitchProps> = (props) => {
  const [popout, setPopout] = useStorageKey<boolean>("popout")
  return (
    <Box {...props}>
      <FormControlLabel
        control={
          <Switch size="small" checked={popout} onChange={(e, checked) => setPopout(checked)} />
        }
        label="Release on the page"
      />
    </Box>
  )
}
