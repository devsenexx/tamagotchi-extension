import { Coords } from "./lib/types"
import { getRandomMovement } from "./pet_utils"

export type PetStatName = "hunger" | "energy" | "bladder"
export interface PetStat {
  depleteRate: number
}
export type PetStats = Record<PetStatName, number>
const DAY = 86400 // in secs

export default class PetData {
  id: string
  name: string
  sprite: string
  spriteImage?: HTMLImageElement
  position: Coords & { direction: "left" | "right" } = { x: 0, y: 0, direction: "left" }

  // stats
  stats: PetStats = fullStats()

  constructor({
    name,
    sprite,
    stats = fullStats(),
    position,
  }: {
    name: string
    sprite: string
    stats?: PetStats
    position?: Coords & { direction: "left" | "right" }
  }) {
    this.name = name
    this.sprite = sprite
    this.stats = stats
    if (position) {
      this.position = { ...this.position, ...position }
    }
    this.initSprite()
  }

  private initSprite() {
    if (global.Image !== undefined && this.sprite && chrome.runtime?.id) {
      this.spriteImage = new Image()
      this.spriteImage.src = chrome.runtime.getURL(`assets/images/pets/${this.sprite}.png`)

      if (this.spriteImage.src !== "chrome-extension://invalid/") {
        this.spriteImage.onerror = (e) => {
          this.spriteImage = undefined
          console.warn(
            "error loading sprite",
            chrome.runtime.getURL(`assets/images/pets/${this.sprite}.png`),
            e
          )
        }
      } else {
        this.spriteImage = undefined
        console.warn(`getURL failed for assets/images/pets/${this.sprite}.png`)
      }
    }
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      sprite: this.sprite,
      stats: this.stats,
      position: this.position,
    }
  }

  toString(): string {
    return `Pet(${this.name})`
  }

  tick() {
    for (const key of Object.keys(this.stats)) {
      const k = key as PetStatName
      this.stats[k] = Math.max(this.stats[k] - this.statData[k].depleteRate, 0)
    }
  }

  async moveRandomly(frameSize: number) {
    const { docWidth } = await chrome.storage.local.get("docWidth")
    const { x, direction } = getRandomMovement({
      frameSize,
      x: this.position.x,
      faceDirection: this.position.direction,
      max: (docWidth ?? 800) - frameSize,
    })

    console.log("new pos:", { x, direction })

    this.position = {
      ...this.position,
      x: x,
      direction: direction,
    }
  }

  resetStats() {
    this.stats = fullStats()
  }

  get statData(): Record<PetStatName, PetStat> {
    return {
      hunger: { depleteRate: 1 / (DAY * 2) }, // 2 days to empty
      energy: { depleteRate: 1 / (DAY * 0.75) }, // 18 hours to empty
      bladder: { depleteRate: 1 / (DAY * 0.2) }, // 4.8h to empty
    }
  }
}

function fullStats(): PetStats {
  return {
    hunger: 1,
    energy: 1,
    bladder: 1,
  }
}
