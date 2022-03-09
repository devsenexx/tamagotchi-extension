import { Coords } from "./lib/types"
import { getRandomMovement } from "./pet_utils"

export type PetStatName = "hunger" | "energy" | "bladder"
export interface PetStat {
  depleteRate: number
  restoreRate: number
  action: "deplete" | "restore" | "freeze"
  onFull?(): void
  onEmpty?(): void
}
export interface PetState {
  sleeping: boolean
  eating: boolean
  usingBladder: boolean
  needsCleaning: boolean
}
export type PetStats = Record<PetStatName, number>
const SEC = 1000
const MIN = SEC * 60
const HOUR = MIN * 60 //in secs
const DAY = HOUR * 24 // in secs

export interface Position extends Coords {
  direction: "left" | "right"
}

export default class PetData {
  id: string
  name: string
  sprite: string
  spriteImage?: HTMLImageElement
  position: Position = { x: 0, y: 0, direction: "left" }

  // state & stats
  state: PetState = emptyState()
  stats: PetStats = fullStats()

  constructor({
    name,
    sprite,
    stats = fullStats(),
    position,
    state,
  }: {
    name: string
    sprite: string
    stats?: PetStats
    position?: Position
    state?: PetState
  }) {
    this.name = name
    this.sprite = sprite
    this.stats = stats
    if (position) {
      this.position = { ...this.position, ...position }
    }
    if (state) {
      this.state = { ...this.state, ...state }
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
      state: this.state,
      position: this.position,
    }
  }

  toString(): string {
    return `Pet(${this.name})`
  }

  tick() {
    this.updateStats()
  }

  get isDoingSomething(): boolean {
    return this.state.sleeping || this.state.eating || this.state.usingBladder
  }

  private updateStats() {
    for (const key of this.statKeys) {
      const k = key as PetStatName
      let change: number

      switch (this.statData[k].action) {
        case "deplete":
          change = -this.statData[k].depleteRate
          this.stats[k] = Math.max(this.stats[k] + change, 0)
          break
        case "restore":
          change = +this.statData[k].restoreRate
          this.stats[k] = Math.max(this.stats[k] + change, 0)
          break
        default:
          break
      }
    }
    this.handleStatsLogic()
  }

  handleStatsLogic() {
    for (const key of this.statKeys) {
      if (this.stats[key] === 0) {
        console.log(key, "onEmpty", this.statData[key].onEmpty)
        this.statData[key].onEmpty?.()
      }
      if (this.stats[key] === 1) {
        console.log(key, "onFull", this.statData[key].onFull)
        this.statData[key].onFull?.()
      }
    }
  }

  get statKeys(): Array<keyof PetStats> {
    return Object.keys(this.stats) as Array<keyof PetStats>
  }

  async moveRandomly(frameSize: number) {
    const { docWidth } = await chrome.storage.local.get("docWidth")
    const { x, direction } = getRandomMovement({
      frameSize,
      x: this.position.x,
      faceDirection: this.position.direction,
      max: (docWidth ?? 800) - frameSize,
    })

    this.moveTo({ x: x, direction: direction })
  }

  moveTo(newPosition: Partial<Position>) {
    this.position = { ...this.position, ...newPosition }
  }

  resetStats() {
    this.stats = fullStats()
  }

  get statData(): Record<PetStatName, PetStat> {
    return {
      hunger: {
        depleteRate: 1 / (DAY * 2), // 2d to empty
        restoreRate: 1 / (SEC * 30), // 30s to full
        action: this.state.eating ? "restore" : "deplete",
        onFull: () => (this.state.eating = false),
        // onEmpty: () => this.state.sleeping = true,
      },
      energy: {
        depleteRate: 1 / (HOUR * 18), // 18h to empty
        restoreRate: 1 / (HOUR * 6), // 6h to full
        action: this.state.sleeping ? "restore" : "deplete",
        onFull: () => (this.state.sleeping = false),
        onEmpty: () => (this.state.sleeping = true),
      },
      bladder: {
        depleteRate: 1 / (HOUR * 4), // 4h to empty
        restoreRate: 1 / (SEC * 6), // 6s to full
        action: this.state.usingBladder ? "restore" : "deplete",
        onFull: () => {
          this.state.usingBladder = false
          this.state.needsCleaning = true
        },
        onEmpty: () => (this.state.usingBladder = true),
      },
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
function emptyState(): PetState {
  return {
    sleeping: false,
    eating: false,
    usingBladder: false,
    needsCleaning: false,
  }
}
