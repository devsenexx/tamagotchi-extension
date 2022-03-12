import React from "react"
import PetData from "../lib/pet_data"
import { useTick } from "./tick"
import { useCanvas } from "./sprite_hooks"

const MOD = 500
const SPEED = 40
const SPRITE_SIZE = 24
const BG_SIZE = 32
const PET_FRAME_COUNT = 2
const DROPPING_FRAME_COUNT = 3

export function usePetSprite({
  ctx,
  pet,
  width,
  height,
  padding,
  useBackground,
}: {
  ctx: CanvasRenderingContext2D
  pet: PetData
  width: number
  height: number
  padding: number
  faceDirection: "left" | "right"
  useBackground?: boolean
}) {
  const { frame } = useTick()
  const petAnimFrame = React.useMemo(() => Math.floor(frame / SPEED) % PET_FRAME_COUNT, [frame])
  const bgAnimFrame = React.useMemo(
    () => Math.floor(((frame / SPEED) * 2) % (width * 2)) - width,
    [frame]
  )

  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D): void => {
      if (useBackground && pet.backgroundImage) {
        ctx.drawImage(
          pet.backgroundImage,
          0,
          0,
          BG_SIZE,
          BG_SIZE,
          0,
          0,
          width,
          height // dest h
        )
        ctx.drawImage(
          pet.backgroundImage,
          0,
          BG_SIZE,
          BG_SIZE,
          BG_SIZE,
          bgAnimFrame,
          0,
          width,
          height // dest h
        )
      }
      if (pet.spriteImage) {
        ctx.drawImage(
          pet.spriteImage,
          petAnimFrame * SPRITE_SIZE,
          0,
          SPRITE_SIZE,
          SPRITE_SIZE,
          padding,
          padding,
          width - padding * 2,
          height - padding * 2
        )
      }
    },
    [petAnimFrame, bgAnimFrame]
  )
  useCanvas(ctx, draw, { width, height })
}
