import React from "react"
import { usePetPeriodically } from "../lib/pet_hooks"
import { PetCanvas } from "./PetCanvas"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { StatBars } from "./StatBars"
import { DebugInfo } from "./DebugInfo"
import Switch from "@mui/material/Switch"
import Link from "@mui/material/Link"
import { FormControlLabel } from "@mui/material"
import { savePet } from "../pet_utils"
import PetData from "../pet_data"
import { Actions } from "./Actions"
import { POPUP_FRAME_SIZE } from "../lib/consts"

export const PopupHome: React.FC = () => {
  const pet = usePetPeriodically()
  const [popout, setPopout] = React.useState(false)

  React.useEffect(() => {
    chrome.storage.local.get("popout").then(({ popout }) => setPopout(popout))
  }, [])

  if (!pet) {
    return (
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault()
          const newPet = new PetData({ name: "Jimmy", sprite: "chicken-test" })
          savePet(newPet, { sync: true })
          savePet(newPet)
        }}
      >
        Create
      </Link>
    )
  }

  return (
    <Box sx={{ padding: (theme) => theme.spacing(2) }}>
      <Grid container alignItems="stretch" direction="column" spacing={1}>
        <Grid item>
          <Typography variant="h4" textAlign="center">
            {pet.name}

            <div>
              <FormControlLabel
                control={
                  <Switch
                    checked={popout}
                    onChange={async (e, checked) => {
                      chrome.storage.local.set({ popout: checked })
                      const tabs = await chrome.tabs.query({})
                      for (const tab of tabs) {
                        chrome.tabs.sendMessage(tab.id, { action: "popout", payload: checked })
                      }
                      setPopout(checked)
                    }}
                  />
                }
                label="Pop Out"
              />
            </div>
          </Typography>
        </Grid>
        <Grid item sx={{ textAlign: "center" }}>
          <PetCanvas
            pet={pet}
            width={POPUP_FRAME_SIZE}
            height={POPUP_FRAME_SIZE}
            padding={16}
            faceDirection="left"
          />
        </Grid>
        <Grid item>
          <StatBars />
        </Grid>
        <Grid item>
          <Actions />
        </Grid>
        <Grid item sx={{ maxWidth: "100% !important" }}>
          <DebugInfo />
        </Grid>
      </Grid>
    </Box>
  )
}
