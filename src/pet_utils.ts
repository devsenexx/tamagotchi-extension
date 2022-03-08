import PetData from "./pet_data"

export async function getPet(): Promise<PetData> {
  const { currentPet } = await chrome.storage.sync.get("currentPet")
  if (currentPet) {
    return new PetData(currentPet)
  } else {
    const pet = new PetData({ name: "Jimmy", sprite: "chicken-test" })
    chrome.storage.sync.set({ currentPet: pet })
    return pet
  }
}

export async function savePet(pet: PetData): Promise<void> {
  return chrome.storage.sync.set({ currentPet: pet })
}
