export type PetStatName = "hunger" | "energy" | "bladder"
export interface PetStat {
  depleteRate: number
}
export type PetStats = Record<PetStatName, number>
const DAY = 86400 // in secs

export default class PetData {
  name: string
  sprite: string

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

  get spriteImage(): HTMLImageElement {
    const img = new Image()
    img.src = `assets/images/pets/${this.sprite}.png`
    return img
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
