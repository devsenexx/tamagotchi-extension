import React from "react"
import { usePet } from "../lib/pet_hooks"
import { PetCanvas } from "./PetCanvas"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { StatBars } from "./StatBars"
import { DebugInfo } from "./DebugInfo"
import Switch from "@mui/material/Switch"

const FRAME_SIZE = 128

export const PopupHome: React.FC = () => {
  const pet = usePet()
  const [popout, setPopout] = React.useState(false)

  React.useEffect(() => {
    chrome.storage.local.get("popout").then(({ popout }) => setPopout(popout))
  }, [])

  if (!pet) {
    return null
  }

  return (
    <Box sx={{ padding: (theme) => theme.spacing(2) }}>
      <Grid container alignItems="stretch" direction="column" spacing={1}>
        <Grid item>
          <Typography variant="h4" textAlign="center">
            {pet.name}

            <div>
              <Switch
                checked={popout}
                onChange={(e, checked) => {
                  chrome.storage.local.set({ popout: checked })
                  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "popout", payload: checked })
                  })
                  setPopout(checked)
                }}
              />
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault()
                  // pet.resetStats()
                  const { popout } = await chrome.storage.local.get("popout")
                }}
              >
                Toggle popout
              </a>
            </div>
          </Typography>
        </Grid>
        <Grid item sx={{ textAlign: "center" }}>
          <PetCanvas pet={pet} width={FRAME_SIZE} height={FRAME_SIZE} faceDirection="left" />
        </Grid>
        <Grid item>
          <StatBars />
        </Grid>
        <Grid item sx={{ maxWidth: "100% !important" }}>
          <DebugInfo />
        </Grid>
      </Grid>
    </Box>
  )
}
