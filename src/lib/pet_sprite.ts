import React from "react"
import PetData, { PetState } from "../lib/pet_data"
import { useTick } from "./tick"
import { useCanvas } from "./sprite_hooks"
import { animations } from "./animation_sets"

const SPRITE_WIDTH = 32
const SPRITE_HEIGHT = 32
const BG_SIZE = 32

export function usePetSprite({
  ctx,
  pet,
  width,
  height,
  padding,
  useBackground,
  lockState,
}: {
  ctx: CanvasRenderingContext2D
  pet: PetData
  width: number
  height: number
  padding: number
  faceDirection: "left" | "right"
  useBackground?: boolean
  lockState?: PetState
}) {
  const { frame } = useTick()
  const petAnim = animations[pet.sprite]
  const anim = (lockState ? petAnim[lockState] : petAnim[pet.state]) ?? petAnim.idle
  const petAnimFrame = React.useMemo(
    () => Math.floor(frame / anim.frameSpeed) % anim.frameCount,
    [frame, anim]
  )
  const bgAnimFrame = React.useMemo(
    () => Math.floor(((frame / petAnim.idle.frameSpeed) * 2) % (width * 2)) - width,
    [frame]
  )

  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D): void => {
      if (useBackground && pet.backgroundImage) {
        ctx.drawImage(pet.backgroundImage, 0, 0, BG_SIZE, BG_SIZE, 0, 0, width, height)
        ctx.drawImage(
          pet.backgroundImage,
          0,
          BG_SIZE,
          BG_SIZE,
          BG_SIZE,
          bgAnimFrame,
          0,
          width,
          height
        )
      }
      if (pet.spriteImage) {
        ctx.drawImage(
          pet.spriteImage,
          petAnimFrame * SPRITE_WIDTH,
          anim.frameRow * SPRITE_WIDTH,
          SPRITE_WIDTH,
          SPRITE_HEIGHT,
          padding,
          padding,
          width - padding * 2,
          height - padding * 2
        )
      }
    },
    [petAnimFrame, bgAnimFrame, anim]
  )
  useCanvas(ctx, draw, { width, height })
}
