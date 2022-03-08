import PetData from "./pet_data"

export async function getPet({ sync }: { sync?: boolean }): Promise<PetData> {
  const { currentPet } = await chrome.storage[sync ? "sync" : "local"].get("currentPet")
  if (currentPet) {
    return new PetData(currentPet)
  } else {
    const pet = new PetData({ name: "Jimmy", sprite: "chicken-test" })
    chrome.storage[sync ? "sync" : "local"].set({ currentPet: pet })
    return pet
  }
}

export async function savePet(pet: PetData, { sync }: { sync?: boolean }): Promise<void> {
  return chrome.storage[sync ? "sync" : "local"].set({ currentPet: pet })
}
