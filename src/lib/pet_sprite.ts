import React from "react"
import PetData from "../pet_data"
import { useTick } from "./tick"

const MOD = 500
const SPEED = 40
const SPRITE_SIZE = 24
const BG_SIZE = 32
const FRAME_COUNT = 2

export function usePetSprite({
  canvas,
  pet,
  width,
  height,
  faceDirection,
  padding,
  useBackground,
}: {
  canvas: HTMLCanvasElement
  pet: PetData
  width: number
  height: number
  padding: number
  faceDirection: "left" | "right"
  useBackground?: boolean
}) {
  const { frame } = useTick()

  const petAnimFrame = React.useMemo(() => Math.floor(frame / SPEED) % FRAME_COUNT, [frame])
  const bgAnimFrame = React.useMemo(
    () => {
      return Math.floor(((frame / SPEED) * 2) % (width * 2)) - width
    }, //  / (SPEED * 2)
    [frame]
  )

  // console.debug({petAnimFrame,bgAnimFrame})

  const draw = React.useCallback(() => {
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext("2d")
    // setup canvas
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, width, height)
    if (useBackground && pet.backgroundImage) {
      ctx.drawImage(
        pet.backgroundImage,
        0, // source x
        0, // source y
        BG_SIZE, // source w
        BG_SIZE, // source h
        0, // dest x
        0, // dest y
        width, // dest w
        height // dest h
      )
      ctx.drawImage(
        pet.backgroundImage,
        0, // source x
        BG_SIZE, // source y
        BG_SIZE, // source w
        BG_SIZE, // source h
        bgAnimFrame, // dest x
        0, // dest y
        width, // dest w
        height // dest h
      )
    }
    if (pet.spriteImage) {
      ctx.drawImage(
        pet.spriteImage,
        petAnimFrame * SPRITE_SIZE, // source x
        0, // source y
        SPRITE_SIZE, // source w
        SPRITE_SIZE, // source h
        padding, // dest x
        padding, // dest y
        width - padding * 2, // dest w
        height - padding * 2 // dest h
      )
    }
  }, [petAnimFrame, bgAnimFrame])

  React.useLayoutEffect(() => {
    if (!canvas) {
      return
    }

    let animationFrameId: number

    const render = () => {
      draw()
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [canvas, frame])
}
