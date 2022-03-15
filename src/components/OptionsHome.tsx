import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useStorageKey } from "../lib/use_storage"
import { Checkbox, Divider, ListItem, ListItemIcon, ListItemText } from "@mui/material"

export const OptionsHome: React.FC = () => {
  const [debug = false, setDebug] = useStorageKey<boolean>("debug")

  return (
    <Box sx={{ padding: (theme) => theme.spacing(2) }}>
      <Typography variant="h5">PlayPet Options</Typography>
      <Divider sx={{ margin: (theme) => theme.spacing(2, 0) }} />
      <ListItem button onClick={() => setDebug(!debug)}>
        <ListItemIcon>
          <Checkbox checked={debug} onChange={(_e, checked) => setDebug(checked)} />
        </ListItemIcon>
        <ListItemText
          primary="Debug Mode"
          secondary="Shows debug information &amp; controls in various places"
        />
      </ListItem>
    </Box>
  )
}
