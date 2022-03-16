import { PetState } from "./pet_data"

export type PetAnimation<S extends PetState = PetState> = Record<S, Animation>

export interface Animation {
  frameCount: number
  frameSpeed: number
  frameRow: number
}

const chickenAnimations: PetAnimation<"idle" | "moving" | "sleeping" | "eating"> = {
  idle: {
    frameCount: 2,
    frameSpeed: 40,
    frameRow: 0,
  },
  moving: {
    frameCount: 9,
    frameSpeed: 5,
    frameRow: 1,
  },
  sleeping: {
    frameCount: 1,
    frameSpeed: 1,
    frameRow: 2,
  },
  eating: {
    frameCount: 9,
    frameSpeed: 5,
    frameRow: 3,
  },
}

export const animations: Record<string, PetAnimation<any>> = {
  "chicken-test": chickenAnimations,
}
