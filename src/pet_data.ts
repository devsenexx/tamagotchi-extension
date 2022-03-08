import Component from "./component"

export type PetStatName = "health" | "energy" | "bladder"
export interface PetStat {
  depleteRate: number
}
export type PetStats = Record<PetStatName, number>

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
      health: { depleteRate: 0.0005 },
      energy: { depleteRate: 0.001 },
      bladder: { depleteRate: 0.002 },
    }
  }
}

function fullStats(): PetStats {
  return {
    health: 1,
    energy: 1,
    bladder: 1,
  }
}
