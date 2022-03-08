import React from "react"
import { ProgressBar } from "./ProgressBar"
import Grid from "@mui/material/Grid"
import { usePet } from "../lib/pet_hooks"

export const StatBars = () => {
  const pet = usePet()
  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <ProgressBar
          value={pet.stats.hunger}
          fg="#9c0000"
          bg="#ff8f8f"
          textColor="#ffffff"
          // label={(perc) => `Hunger ${perc.toFixed(2)}%`}
          label="Hunger"
          // showPerc={false}
        />
      </Grid>
      <Grid item xs={4}>
        <ProgressBar
          value={pet.stats.energy}
          fg="#009c0d"
          bg="#8fff9e"
          textColor="#ffffff"
          // label={(perc) => `Energy ${perc.toFixed(2)}%`}
          label="Energy"
          // showPerc={false}
        />
      </Grid>
      <Grid item xs={4}>
        <ProgressBar
          value={pet.stats.bladder}
          fg="#003e9c"
          bg="#8fb3ff"
          textColor="#ffffff"
          // label={(perc) => `Bladder ${perc.toFixed(2)}%`}
          label="Bladder"
          // showPerc={false}
        />
      </Grid>
    </Grid>
  )
}
