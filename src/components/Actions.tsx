import React from "react"
import { ProgressBar } from "./ProgressBar"
import Grid from "@mui/material/Grid"
import { usePetPeriodically } from "../lib/pet_hooks"
import Button from "@mui/material/Button"
import { PetState, PetStats } from "../pet_data"
import { getPet, savePet } from "../pet_utils"

export const Actions = () => {
  const pet = usePetPeriodically()

  if (!pet) {
    return null
  }

  function updateStat(
    key: keyof PetState,
    state: boolean
  ): React.MouseEventHandler<HTMLButtonElement> {
    return async () => {
      pet.state[key] = state
      await savePet(pet, { sync: false })
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#9c0000",
            "&:hover": {
              backgroundColor: "#b61515",
            },
          }}
          onClick={updateStat("eating", true)}
          disabled={pet.state.eating || pet.state.sleeping}
        >
          Feed
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#009c0d",
            "&:hover": {
              backgroundColor: "#14ac21",
            },
          }}
          onClick={updateStat("sleeping", !pet.state.sleeping)}
        >
          {!pet.state.sleeping ? "Sleep" : "Wake"}
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#003e9c",
            "&:hover": {
              backgroundColor: "#0d4caa",
            },
          }}
          disabled={!pet.state.needsCleaning}
          onClick={updateStat("needsCleaning", false)}
        >
          Clean
        </Button>
      </Grid>
    </Grid>
  )
}
