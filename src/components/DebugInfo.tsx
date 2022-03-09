import React from "react"
import PetData from "../pet_data"
import { savePet } from "../pet_utils"
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
              savePet(newPet, { sync: false })
            }}
          >
            New Pet
          </Link>
        </div>

        <pre>
          <code>{JSON.stringify(pet, undefined, 2)}</code>
        </pre>

        <pre>
          <code>{JSON.stringify({ frame, delta, docWidth }, undefined, 1)}</code>
        </pre>
      </div>
    </details>
  )
})
