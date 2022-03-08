import React from "react"
import { usePet } from "../lib/pet_hooks"
import { PetCanvas } from "./PetCanvas"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { StatBars } from "./StatBars"
import { DebugInfo } from "./DebugInfo"

const FRAME_SIZE = 128

export const PopupHome: React.FC = () => {
  const pet = usePet()

  if (!pet) {
    return null
  }

  return (
    <Box sx={{ padding: (theme) => theme.spacing(2) }}>
      <Grid container alignItems="stretch" direction="column" spacing={1}>
        <Grid item>
          <Typography variant="h4" textAlign="center">
            {pet.name}
          </Typography>
        </Grid>
        <Grid item sx={{ textAlign: "center" }}>
          <PetCanvas pet={pet} width={FRAME_SIZE} height={FRAME_SIZE} />
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
