import React from "react"
import Box from "@mui/material/Box"
import { usePetPeriodically } from "../lib/pet_hooks"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import EditIcon from "@mui/icons-material/Edit"
import CheckIcon from "@mui/icons-material/Check"
import { savePet } from "../lib/pet_utils"
import { useStorageKey } from "../lib/use_storage"

export const PetHeader: React.FC = () => {
  const pet = usePetPeriodically()
  const [popout, setPopout] = useStorageKey<boolean>("popout")
  const [editing, setEditing] = React.useState(false)
  const [name, setName] = React.useState("")

  React.useEffect(() => {
    if (pet && !name) setName(pet.name)
  }, [pet])

  if (!pet) {
    return null
  }

  return (
    <Box sx={{ padding: (theme) => theme.spacing(2) }}>
      <Typography variant="h4" textAlign="center">
        {editing ? (
          <>
            <TextField
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                pet.name = e.target.value
                savePet(pet, { sync: true })
              }}
            />
            <CheckIcon onClick={() => setEditing(!editing)} />
          </>
        ) : (
          <>
            {name} <EditIcon onClick={() => setEditing(!editing)} />
          </>
        )}
      </Typography>
      <FormControlLabel
        control={
          <Switch size="small" checked={popout} onChange={(e, checked) => setPopout(checked)} />
        }
        label="Release on the page"
      />
    </Box>
  )
}
