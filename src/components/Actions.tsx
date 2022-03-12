import React from "react"
import Grid from "@mui/material/Grid"
import { usePetPeriodically } from "../lib/pet_hooks"
import Button from "@mui/material/Button"
import PetData, { PetState } from "../lib/pet_data"
import { savePet } from "../lib/pet_utils"

export const Actions = () => {
  const pet = usePetPeriodically()

  if (!pet) {
    return null
  }

  function updateStat(
    state: PetState | undefined,
    newValue: boolean | undefined,
    beforeSave?: (pet: PetData) => void
  ): React.MouseEventHandler<HTMLButtonElement> {
    return () => {
      if (state) {
        pet.state = newValue ? state : "idle"
      }
      return withSave(beforeSave)
    }
  }

  async function withSave(beforeSave?: (pet: PetData) => void) {
    beforeSave?.(pet)
    return savePet(pet)
  }

  const defaultButtonStyle = {
    textTransform: "none",
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Button
          variant="outlined"
          fullWidth
          sx={[
            defaultButtonStyle,
            {
              borderColor: "#9c0000",
              color: "#9c0000",
              "&:hover": {
                borderColor: "#b61515",
                color: "#b61515",
              },
            },
          ]}
          onClick={updateStat("eating", true)}
          disabled={pet.isDoingSomething || pet.stats.hunger > 0.7}
        >
          Feed
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="outlined"
          fullWidth
          sx={[
            defaultButtonStyle,
            {
              borderColor: "#009c0d",
              color: "#009c0d",
              "&:hover": {
                borderColor: "#14ac21",
                color: "#14ac21",
              },
            },
          ]}
          onClick={updateStat("sleeping", pet.state !== "sleeping")}
        >
          {pet.state !== "sleeping" ? "Sleep" : "Wake"}
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          variant="outlined"
          fullWidth
          sx={[
            defaultButtonStyle,
            {
              borderColor: "#003e9c",
              color: "#003e9c",
              "&:hover": {
                borderColor: "#0d4caa",
                color: "#0d4caa",
              },
            },
          ]}
          disabled={!pet.hasDroppings}
          onClick={() => withSave((pet) => pet.cleanDroppings())}
        >
          Clean
        </Button>
      </Grid>
    </Grid>
  )
}
