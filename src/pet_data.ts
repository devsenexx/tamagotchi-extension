export type PetStatName = "hunger" | "energy" | "bladder"
export interface PetStat {
  depleteRate: number
}
export type PetStats = Record<PetStatName, number>
const DAY = 86400 // in secs

export default class PetData {
  name: string
  sprite: string
  spriteImage?: HTMLImageElement

  // stats
  stats: PetStats = fullStats()

  constructor({
    name,
    sprite,
    stats = fullStats(),
  }: {
    name: string
    sprite: string
    stats?: PetStats
  }) {
    this.name = name
    this.sprite = sprite
    this.stats = stats
    if (global.Image !== undefined && this.sprite) {
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
