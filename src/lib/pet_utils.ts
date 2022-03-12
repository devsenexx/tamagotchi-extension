import PetData from "./pet_data"
import clamp from "lodash/clamp"
import rand from "lodash/random"

export async function getPet({
  sync,
  create,
}: {
  sync?: boolean
  create?: boolean
} = {}): Promise<PetData | undefined> {
  const { currentPet } = await chrome.storage[sync ? "sync" : "local"].get("currentPet")
  if (currentPet) {
    return new PetData(currentPet)
  } else if (create) {
    const pet = new PetData({ name: "Jimmy", sprite: "chicken-test" })
    chrome.storage[sync ? "sync" : "local"].set({ currentPet: pet })
    return pet
  }
}

export async function savePet(pet: PetData, { sync }: { sync?: boolean } = {}): Promise<void> {
  await chrome.storage.local.set({ currentPet: pet })
  if (sync) {
    await chrome.storage.sync.set({ currentPet: pet })
  }
}
