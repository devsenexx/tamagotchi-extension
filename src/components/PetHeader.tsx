import React from "react"
import Box from "@mui/material/Box"
import { usePetPeriodically } from "../lib/pet_hooks"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import EditIcon from "@mui/icons-material/Edit"
import CheckIcon from "@mui/icons-material/Check"
import IconButton from "@mui/material/IconButton"
import { savePet } from "../lib/pet_utils"
import Grid from "@mui/material/Grid"

export const PetHeader: React.FC = () => {
  const pet = usePetPeriodically()
  const [editing, setEditing] = React.useState(false)
  const [name, setName] = React.useState("")

  React.useEffect(() => {
    if (pet && !name) setName(pet.name)
  }, [pet])

  const toggleEdit = React.useCallback(() => setEditing(!editing), [editing])

  if (!pet) {
    return null
  }

  return (
    <Box sx={{ padding: (theme) => theme.spacing(2) }}>
      <Grid container alignItems="center">
        <Grid item xs>
          {editing ? (
            <TextField
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                pet.name = e.target.value
                savePet(pet, { sync: true })
              }}
            />
          ) : (
            <Typography variant="h4" textAlign="center">
              {name}
              <IconButton onClick={toggleEdit}>
                <EditIcon />
              </IconButton>
            </Typography>
          )}
        </Grid>
        <Grid item>
          {editing ? (
            <IconButton onClick={toggleEdit}>
              <CheckIcon />
            </IconButton>
          ) : null}
        </Grid>
      </Grid>
    </Box>
  )
}
