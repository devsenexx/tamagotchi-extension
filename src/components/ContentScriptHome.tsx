import React from "react"
import { usePet } from "../lib/pet_hooks"
import { PetCanvas } from "./PetCanvas"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { StatBars } from "./StatBars"
import { DebugInfo } from "./DebugInfo"
import Switch from "@mui/material/Switch"

const FRAME_SIZE = 96

export const ContentScriptHome: React.FC = () => {
  const pet = usePet()
  // const root = React.useRef<HTMLDivElement>(
  //   document.getElementById("__playpet__frame__") as HTMLDivElement
  // )
  const [left, setLeft] = React.useState(window.innerWidth - FRAME_SIZE)
  const [faceDirection, setDirection] = React.useState<"left" | "right">("left")

  function moveRandomly() {
    const MOVE_MAX = 90
    const moveAmount = Math.floor(Math.random() * MOVE_MAX)
    const maxX = window.innerWidth - FRAME_SIZE
    const oldX = left
    console.log(`max(0, min(o+a ${oldX + moveAmount}, max ${maxX}))`)
    // let randDirection = Math.round(Math.random()) === 0 ? "left" : "right"
    // let fixedMoveAmount = randDirection === "left" ? -moveAmount : moveAmount
    let fixedMoveAmount = faceDirection === "left" ? -moveAmount : moveAmount

    if (oldX + fixedMoveAmount > maxX || oldX + fixedMoveAmount < 0) {
      console.log("flipping", { faceDirection, oldX, moveAmount })
      const newDirection = faceDirection === "left" ? "right" : "left"
      fixedMoveAmount *= -1
      setDirection(newDirection)
    }

    const newX = Math.max(0, Math.min(oldX + fixedMoveAmount, maxX))

    console.log("move from", oldX, "to", newX)
    // root.current.style.left = r.toString() + "px"
    // const newDirection = newX < oldX ? "left" : "right"

    // if (faceDirection !== newDirection) {
    //   console.log("flip to ", newDirection)
    //   setDirection(newDirection)
    // }
    setLeft(newX)
  }

  function faceRandomly() {
    setDirection(Math.round(Math.random()) === 0 ? "left" : "right")
  }
  // const parent = React.useRef<HTMLDivElement>()

  // React.useEffect(() => {
  //   parent.current = root.current.parentElement as HTMLDivElement
  // }, [root.current])

  React.useEffect(() => {
    moveRandomly()
    faceRandomly()
  }, [])

  React.useEffect(() => {
    // if (!root.current) {
    //   return
    // }
    const id = setInterval(() => {
      moveRandomly()

      // parent.current.style.top
    }, 5000)
    return () => clearInterval(id)
  }, [left])

  if (!pet) {
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        width: FRAME_SIZE,
        height: FRAME_SIZE,
        top: 0,
        left,
        transition: "all 5s ease-in-out",
        zIndex: 999999999999,
      }}
    >
      <PetCanvas pet={pet} width={FRAME_SIZE} height={FRAME_SIZE} faceDirection={faceDirection} />
    </div>
  )
}
