import React from "react"
import { usePetFromTick } from "../lib/pet_hooks"
import { PetCanvas } from "./PetCanvas"
import { DroppingCanvas } from "./DroppingCanvas"
import random from "lodash/random"
import { MOVE_DURATION, DOCUMENT_FRAME_SIZE, DROPPINGS_FRAME_SIZE } from "../lib/consts"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { savePet } from "../lib/pet_utils"

export const ContentScriptHome: React.FC = () => {
  const pet = usePetFromTick()
  const [left, setLeft] = React.useState(random(0.1, 0.9))
  const [faceDirection, setDirection] = React.useState<"left" | "right">("left")
  const [freezeAnim, setFreezeAnim] = React.useState(true)

  React.useEffect(() => {
    if (pet && freezeAnim) {
      const id = setTimeout(() => setFreezeAnim(false), 100)
      return () => clearTimeout(id)
    }
  }, [pet, freezeAnim])

  React.useEffect(() => {
    if (!pet) {
      return
    }
    if (pet.position.direction !== faceDirection) {
      setDirection(pet.position.direction)
    }

    if (pet.position.x !== left) {
      setLeft(pet.position.x)
    }
  }, [pet?.position])

  if (!pet) {
    return null
  }

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          width: DOCUMENT_FRAME_SIZE,
          height: DOCUMENT_FRAME_SIZE,
          marginTop: 1,
          top: 0,
          left: (left * 100).toFixed(2) + "%",
          transition: `all ${
            !freezeAnim ? MOVE_DURATION : 10
          }ms cubic-bezier(0.52, 0.25, 0.79, 1.02)`,
          zIndex: 999999999999,
          "& > :last-child": {
            transform: "translateY(-10px)",
            opacity: 0,
            pointerEvents: "none",
            transition: "all 150ms ease-in-out",
          },
          "&:hover > :last-child": {
            transform: "translateY(0px)",
            opacity: 1,
            pointerEvents: "initial",
          },
        }}
      >
        <PetCanvas
          pet={pet}
          width={DOCUMENT_FRAME_SIZE}
          height={DOCUMENT_FRAME_SIZE}
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
            }}
          >
            <Typography variant="caption" noWrap>
              {pet.name} {pet.status ? `(${pet.status})` : null}
            </Typography>
          </Box>
        </Grid>
      </Box>
      {pet.objects.droppings.map((drop) => (
        <Box
          key={"dropping-" + drop.id}
          onClick={function () {
            pet.removeObject("droppings", drop.id)
            savePet(pet, { sync: true })
          }}
          sx={{
            position: "fixed",
            width: DROPPINGS_FRAME_SIZE,
            height: DROPPINGS_FRAME_SIZE,
            marginTop: 1,
            top: 40,
            left: (drop.x * 100).toFixed(2) + "%",
            zIndex: 999999999999,
            cursor: "pointer",
            "& > :last-child": {
              transform: "translateY(-10px)",
              opacity: 0,
              pointerEvents: "none",
              transition: "all 150ms ease-in-out",
            },
            "&:hover > :last-child": {
              transform: "translateY(0px)",
              opacity: 1,
              pointerEvents: "initial",
            },
          }}
        >
          <DroppingCanvas
            dropping={drop}
            image={pet.droppingImage}
            width={DROPPINGS_FRAME_SIZE}
            height={DROPPINGS_FRAME_SIZE}
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
              }}
            >
              <Typography variant="caption" noWrap>
                Click to clean
              </Typography>
            </Box>
          </Grid>
        </Box>
      ))}
    </>
  )
}
