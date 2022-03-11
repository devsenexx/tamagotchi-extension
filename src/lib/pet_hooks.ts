import React from "react"
import PetData from "./pet_data"
import { getPet } from "./pet_utils"
import { TICK_TIMEOUT } from "./consts"

export function usePetFromTick(): PetData | undefined {
  const [pet, setPet] = React.useState<PetData>()

  const messageHandler = React.useCallback(
    ({ action, payload }: any, _, sendResponse: any) => {
      if (["move", "data", "tick"].includes(action)) {
        setPet(new PetData(payload))
      }
      sendResponse({ action: "ack" })
    },
    [pet]
  )

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener(messageHandler)
    return () => chrome.runtime.onMessage.removeListener(messageHandler)
  }, [pet])

  React.useEffect(() => {
    getPet().then((pet) => setPet(pet))
  }, [])

  return pet
}
export function usePetPeriodically(): PetData | undefined {
  const [pet, setPet] = React.useState<PetData>()

  React.useEffect(() => {
    getPet().then((pet) => setPet(pet))

    const id = setInterval(() => {
      getPet().then((pet) => setPet(pet))
    }, TICK_TIMEOUT)
    return () => clearInterval(id)
  }, [])
  return pet
}
