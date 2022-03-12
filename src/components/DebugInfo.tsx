import React from "react"
import PetData from "../lib/pet_data"
import { savePet } from "../lib/pet_utils"
import { usePetPeriodically } from "../lib/pet_hooks"
import { withTick } from "../lib/tick"
import Link from "@mui/material/Link"

export const DebugInfo = withTick(({ frame, delta }) => {
  const pet = usePetPeriodically()
  const [docWidth, setDocWidth] = React.useState(800)

  React.useEffect(() => {
    const id = setInterval(() => {
      chrome.storage.local.get("docWidth").then(({ docWidth }) => setDocWidth(docWidth))
    })
    return () => clearInterval(id)
  }, [docWidth])

  return (
    <details>
      <summary>debug</summary>
      <div style={{ maxWidth: "100%", overflowX: "auto" }}>
        <div>
          <Link
            href="#"
            component="a"
            onClick={(e) => {
              e.preventDefault()
              // pet.resetStats()
              const newPet = new PetData({ name: pet.name, sprite: "chicken-test" })
              savePet(newPet, { sync: true })
            }}
          >
            New Pet
          </Link>
        </div>
        <div>
          <Link
            href="#"
            component="a"
            onClick={(e) => {
              e.preventDefault()
              // pet.resetStats()
              const newPet = new PetData({ ...pet, background: "bg-1" })
              savePet(newPet, { sync: true })
            }}
          >
            Update BG
          </Link>
        </div>
        <div>
          <Link
            href="#"
            component="a"
            onClick={(e) => {
              e.preventDefault()
              const newPet = new PetData(pet)
              newPet.createDropping()
              savePet(newPet, { sync: true })
            }}
          >
            Create dropping
          </Link>
        </div>

        {pet?.statKeys.map((k) => (
          <div key={k}>
            {k}: {(pet.timeEst[k] / 60 / 60).toFixed(2)}h
          </div>
        ))}

        <pre>
          <code>{JSON.stringify(pet?.toDebugJSON() ?? {}, undefined, 2)}</code>
        </pre>

        <pre>
          <code>{JSON.stringify({ frame, delta, docWidth }, undefined, 1)}</code>
        </pre>
      </div>
    </details>
  )
})
