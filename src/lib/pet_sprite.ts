import React from "react"
import PetData, { PetState } from "../lib/pet_data"
import { useTick } from "./tick"
import { useCanvas } from "./sprite_hooks"

const SPRITE_WIDTH = 32
const SPRITE_HEIGHT = 32
const BG_SIZE = 32

const frameCounts: Partial<Record<PetState, number>> = {
  idle: 2,
  moving: 9,
  sleeping: 1,
  eating: 9,
}
const frameSpeeds: Partial<Record<PetState, number>> = {
  idle: 40,
  moving: 5,
  sleeping: 1,
  eating: 3,
}
const frameRows: Partial<Record<PetState, number>> = {
  idle: 0,
  moving: 1,
  sleeping: 2,
  eating: 3,
}

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
  const animKey: PetState = lockState ? lockState : frameCounts[pet.state] ? pet.state : "idle"
  const petAnimFrame = React.useMemo(
    () => Math.floor(frame / frameSpeeds[animKey]) % frameCounts[animKey],
    [frame, animKey]
  )
  const bgAnimFrame = React.useMemo(
    () => Math.floor(((frame / frameSpeeds.idle) * 2) % (width * 2)) - width,
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
          frameRows[animKey] * SPRITE_WIDTH,
          SPRITE_WIDTH,
          SPRITE_HEIGHT,
          padding,
          padding,
          width - padding * 2,
          height - padding * 2
        )
      }
    },
    [petAnimFrame, bgAnimFrame, animKey]
  )
  useCanvas(ctx, draw, { width, height })
}
