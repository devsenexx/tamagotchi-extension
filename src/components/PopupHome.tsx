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
import { savePet } from "../lib/pet_utils"
import PetData from "../lib/pet_data"
import { useStorageKey } from "../lib/use_storage"
import { Actions } from "./Actions"
import { POPUP_FRAME_SIZE } from "../lib/consts"
import { PetHeader } from "./PetHeader"
import { ReleaseSwitch } from "./ReleaseSwitch"

export const PopupHome: React.FC = () => {
  const pet = usePetPeriodically()
  const [debug = false] = useStorageKey<boolean>("debug")
  const [popout = false, setPopout] = useStorageKey<boolean>("popout")

  if (!pet) {
    return (
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault()
          const newPet = new PetData({ name: "Jimmy", sprite: "chicken-test" })
          savePet(newPet, { sync: true })
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
          <PetHeader />
        </Grid>
        <Grid item sx={{ textAlign: "center" }}>
          <PetCanvas
            pet={pet}
            width={POPUP_FRAME_SIZE}
            height={POPUP_FRAME_SIZE}
            faceDirection="left"
            useBackground={true}
            lockState={pet.state === "moving" ? "idle" : undefined}
          />
        </Grid>
        <Grid item>
          <StatBars />
        </Grid>
        <Grid item>
          <Actions />
        </Grid>
        <Grid item>
          <ReleaseSwitch sx={{ marginTop: 2 }} />
        </Grid>
        {debug ? (
          <Grid item sx={{ maxWidth: "100% !important" }}>
            <DebugInfo />
          </Grid>
        ) : null}
      </Grid>
    </Box>
  )
}
