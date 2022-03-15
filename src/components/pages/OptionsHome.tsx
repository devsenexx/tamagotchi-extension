import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useStorageKey } from "../../lib/use_storage"
import Checkbox from "@mui/material/Checkbox"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import manifest from "../../../public/manifest.json"

export const OptionsHome: React.FC = () => {
  const [debug = false, setDebug] = useStorageKey<boolean>("debug")

  return (
    <Box sx={{ backgroundColor: "#ccc", minHeight: "100vh", padding: 2 }}>
      <Box
        sx={{
          padding: (theme) => theme.spacing(2),
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4">PlayPet Options</Typography>
        <List>
          <Divider />
          <ListItem button onClick={() => setDebug(!debug)}>
            <ListItemIcon>
              <Checkbox checked={debug} onChange={(_e, checked) => setDebug(checked)} />
            </ListItemIcon>
            <ListItemText
              primary="Debug Mode"
              secondary="Shows debug information &amp; controls in the popup"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary={`PlayPet Version ${manifest.version}`}
              secondary="Copyright Chen Asraf &copy; 2022 [GICI4E]"
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}
