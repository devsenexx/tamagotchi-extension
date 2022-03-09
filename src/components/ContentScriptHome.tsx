import React from "react"
import { usePetFromTick } from "../lib/pet_hooks"
import { PetCanvas } from "./PetCanvas"
import rand from "lodash/random"
import { savePet } from "../pet_utils"
import { MOVE_DURATION, POPOUT_FRAME_SIZE } from "../lib/consts"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"

export const ContentScriptHome: React.FC = () => {
  const pet = usePetFromTick()
  const [left, setLeft] = React.useState(rand(window.innerWidth - POPOUT_FRAME_SIZE))
  const [faceDirection, setDirection] = React.useState<"left" | "right">("left")
  const [freezeAnim, setFreezeAnim] = React.useState(true)

  React.useEffect(() => {
    if (!pet) {
      return
    }
    if (pet.position.direction !== faceDirection) {
      setDirection(pet.position.direction)
    }

    if (pet.position.x !== left) {
      setLeft(pet.position.x)
      if (freezeAnim) {
        const id = setTimeout(() => {
          console.log("enable smooth anim")
          setFreezeAnim(false)
        }, 300)
        return () => clearTimeout(id)
      }
    }
  }, [pet?.position])

  if (!pet) {
    return null
  }

  return (
    <Box
      sx={{
        position: "fixed",
        width: POPOUT_FRAME_SIZE,
        height: POPOUT_FRAME_SIZE,
        marginTop: 1,
        top: 0,
        left,
        transition: `all ${!freezeAnim ? MOVE_DURATION : 300}ms ease-in-out`,
        zIndex: 999999999999,
        "& > :last-child": {
          opacity: 0,
          pointerEvents: "none",
        },
        "&:hover > :last-child": {
          opacity: 1,
          pointerEvents: "initial",
        },
      }}
    >
      <PetCanvas
        pet={pet}
        width={POPOUT_FRAME_SIZE}
        height={POPOUT_FRAME_SIZE}
        faceDirection={faceDirection}
        padding={0}
      />
      <Grid container justifyContent="center">
        <Box
          sx={{
            background: "#00000080",
            color: "white",
            textAlign: "center",
            borderRadius: 1,
            padding: (theme) => theme.spacing(0, 0.5),
            cursor: "default",
            // marginTop: -2,
          }}
        >
          <Typography variant="caption">{pet.name}</Typography>
          {/* <br />
        {JSON.stringify({ x: left, y: 0, direction: faceDirection })} */}
        </Box>
      </Grid>
    </Box>
  )
}
