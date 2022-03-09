import React from "react"
import { TICK_TIMEOUT } from "../lib/consts"
import PetData from "../pet_data"
import { getPet } from "../pet_utils"

export function usePet(): PetData {
  const [pet, setPet] = React.useState<PetData>(new PetData({ name: "", sprite: "chicken-test" }))

  React.useEffect(() => {
    getPet({ sync: false }).then((pet) => setPet(pet))
    // const id = setInterval(() => {
    //   getPet({ sync: false }).then((pet) => setPet(pet))
    // }, TICK_TIMEOUT)
    // return () => clearInterval(id)
  }, [])
  return pet
}
