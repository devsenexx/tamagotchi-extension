import React from "react"
import PetData from "../pet_data"
import { getPet, savePet } from "../pet_utils"
import { usePet } from "../lib/pet_hooks"
import { withTick } from "../lib/tick"
import { PetCanvas } from "./PetCanvas"
import { ProgressBar } from "./ProgressBar"

const FRAME_SIZE = 128

export const PopupApp: React.FC = withTick(({ frame, delta }) => {
  const pet = usePet()

  if (!pet) {
    return null
  }

  return (
    <div>
      <PetCanvas pet={pet} width={FRAME_SIZE} height={FRAME_SIZE} />

      <details>
        <summary>debug</summary>
        <pre>
          <code>{JSON.stringify(pet?.stats, undefined, 2)}</code>
        </pre>

        <pre>
          <code>{JSON.stringify({ frame, delta }, undefined, 1)}</code>
        </pre>
      </details>

      <ProgressBar value={pet.stats.health} fg="#9c0000" bg="#ff8f8f" />
      <ProgressBar value={pet.stats.energy} fg="#009c0d" bg="#8fff9e" />
      <ProgressBar value={pet.stats.bladder} fg="#003e9c" bg="#8fb3ff" />

      <div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            // pet.resetStats()
            savePet(new PetData({ name: pet.name, sprite: "chicken-test" }))
          }}
        >
          New Pet
        </a>
      </div>
    </div>
  )
})
