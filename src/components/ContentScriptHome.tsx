import React from "react"
import { usePetFromTick } from "../lib/pet_hooks"
import { PetCanvas } from "./PetCanvas"
import rand from "lodash/random"
import { savePet } from "../pet_utils"
import { MOVE_DURATION, POPOUT_FRAME_SIZE } from "../lib/consts"

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
        }, 100)
        return () => clearTimeout(id)
      }
    }
  }, [pet?.position])

  if (!pet) {
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        width: POPOUT_FRAME_SIZE,
        height: POPOUT_FRAME_SIZE,
        top: 0,
        left,
        transition: !freezeAnim ? `all ${MOVE_DURATION}ms ease-in-out` : undefined,
        zIndex: 999999999999,
      }}
    >
      <PetCanvas
        pet={pet}
        width={POPOUT_FRAME_SIZE}
        height={POPOUT_FRAME_SIZE}
        faceDirection={faceDirection}
      />
      {/* <div style={{ textShadow: "0 0 0 2px black" }}>
        {JSON.stringify({ x: left, y: top, direction: faceDirection })}
      </div> */}
    </div>
  )
}
