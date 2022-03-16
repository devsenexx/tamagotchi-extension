import React from "react"
import Box from "@mui/material/Box"
import { BaseProps } from "../../lib/types"
import PetData from "../../lib/pet_data"
import { PetCanvas } from "../PetCanvas"
import { POPUP_FRAME_SIZE } from "../../lib/consts"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import { savePet } from "../../lib/pet_utils"

export interface CreatePetViewProps extends BaseProps {
  //
}

export const CreatePetView: React.FC<CreatePetViewProps> = () => {
  const [loading, setLoading] = React.useState(false)
  const [pet, setPet] = React.useState<PetData>(
    new PetData({ name: "", sprite: "chicken-test", background: "bg-1" })
  )

  const onRename = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
      const newPet = new PetData(pet)
      newPet.name = e.target.value
      setPet(newPet)
    },
    [pet, pet.name]
  )

  const createPet = React.useCallback(() => {
    setLoading(true)
    savePet(pet, { sync: true })
  }, [pet])

  return (
    <Box sx={[{ padding: 2 }, loading && { opacity: 0.5, pointerEvents: "none" }]}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h4">Create A Pet</Typography>
        </Grid>
        <Grid item>
          <TextField
            sx={{ marginTop: 2 }}
            value={pet.name}
            onChange={onRename}
            label="Give your pet a name"
            placeholder="Pet name"
          />
        </Grid>
        <Grid item>
          <PetCanvas
            pet={pet}
            width={POPUP_FRAME_SIZE}
            height={POPUP_FRAME_SIZE}
            faceDirection="left"
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" disabled={!pet.name} onClick={createPet}>
            Create
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
