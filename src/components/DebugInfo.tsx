import React from "react"
import PetData from "../pet_data"
import { savePet } from "../pet_utils"
import { usePet } from "../lib/pet_hooks"
import { withTick } from "../lib/tick"

export const DebugInfo = withTick(({ frame, delta }) => {
  const pet = usePet()

  return (
    <details>
      <summary>debug</summary>
      <div style={{ maxWidth: "100%", overflowX: "auto" }}>
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              // pet.resetStats()
              savePet(new PetData({ name: pet.name, sprite: "chicken-test" }), { sync: true })
            }}
          >
            New Pet
          </a>
        </div>
        <pre>
          <code>{JSON.stringify(pet?.stats, undefined, 2)}</code>
        </pre>

        <pre>
          <code>{JSON.stringify({ frame, delta }, undefined, 1)}</code>
        </pre>
      </div>
    </details>
  )
})
