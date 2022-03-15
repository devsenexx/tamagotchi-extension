import React from "react"
import { usePetPeriodically } from "../../lib/pet_hooks"
import { PetCanvas } from "../PetCanvas"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { StatBars } from "../StatBars"
import { DebugInfo } from "../DebugInfo"
import { useStorageKey } from "../../lib/use_storage"
import { Actions } from "../Actions"
import { POPUP_FRAME_SIZE } from "../../lib/consts"
import { PetHeader } from "../PetHeader"
import { ReleaseSwitch } from "../ReleaseSwitch"
import { CreatePetView } from "./CreatePetView"

export const PopupHome: React.FC = () => {
  const pet = usePetPeriodically()
  const [debug = false] = useStorageKey<boolean>("debug")

  if (!pet) {
    return <CreatePetView />
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
