import clamp from "lodash/clamp"
import { TICK_TIMEOUT } from "./consts"
import { Coords, SubType } from "./types"
import { getRandomMovement } from "./pet_utils"
import random from "lodash/random"
import uniqueId from "lodash/uniqueId"

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
const SEC = 1000 / TICK_TIMEOUT
const MIN = SEC * 60
const HOUR = MIN * 60 //in secs
const DAY = HOUR * 24 // in secs

export interface Position extends Coords {
  direction: "left" | "right"
}

export type PetObject = Coords & {
  id: string
}

export default class PetData {
  id: string
  name: string
  sprite: string
  background: string
  spriteImage?: HTMLImageElement
  backgroundImage?: HTMLImageElement
  droppingImage?: HTMLImageElement
  position: Position

  // objects such as droppings, toys, etc...
  objects: Record<"droppings", Array<Coords & { id: string }>> = {
    droppings: [],
  }
  // state & stats
  state: PetState
  stats: PetStats

  constructor({
    name,
    sprite,
    background,
    stats = fullStats(),
    position,
    state,
    objects,
  }: {
    name: string
    sprite: string
    background?: string
    stats?: PetStats
    position?: Position
    state?: PetState
    objects?: Record<"droppings", Array<PetObject>>
  }) {
    this.name = name
    this.sprite = sprite
    this.background = background

    this.position = { x: 0, y: 0, direction: "left", ...position }
    this.stats = { ...fullStats(), ...stats }
    this.objects = { droppings: [], ...objects }
    this.state = {
      ...emptyState(),
      needsCleaning: this.objects.droppings.length > 0,
      ...state,
    }

    this.initSprites()
  }

  private initSprites() {
    if (global.Image !== undefined && chrome.runtime?.id) {
      this.loadImage("spriteImage", `assets/images/pets/${this.sprite}.png`)
      this.loadImage("backgroundImage", `assets/images/backgrounds/${this.background}.png`)
      this.loadImage("droppingImage", "assets/images/sprites/dropping.png")
    }
  }

  loadImage(key: keyof SubType<PetData, HTMLImageElement>, url: string) {
    if (url) {
      const self: any = this
      self[key] = new Image()
      self[key].src = chrome.runtime.getURL(`${url}`)

      if (self[key].src !== "chrome-extension://invalid/") {
        self[key].onerror = (e: any) => {
          self[key] = undefined
          console.warn("error loading background", chrome.runtime.getURL(url), e)
        }
      } else {
        self[key] = undefined
        console.warn(`getURL failed for ${url}`)
      }
    }
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      sprite: this.sprite,
      background: this.background,
      stats: this.stats,
      state: this.state,
      position: this.position,
      objects: this.objects,
    }
  }

  toDebugJSON() {
    return {
      ...this.toJSON(),
      statData: this.statData,
      timeEst: this.timeEst,
      isDoingSomething: this.isDoingSomething,
      canMove: this.canMove,
    }
  }

  calcTimeLeft(distance: number, speed: number): number {
    return distance / speed
  }

  get timeEst(): Record<PetStatName, number> {
    return {
      hunger: this.calcTimeLeft(this.stats.hunger, this.statData.hunger.depleteRate),
      energy: this.calcTimeLeft(this.stats.energy, this.statData.energy.depleteRate),
      bladder: this.calcTimeLeft(this.stats.bladder, this.statData.bladder.depleteRate),
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
  get canMove(): boolean {
    return !this.isDoingSomething
  }

  private updateStats() {
    for (const key of this.statKeys) {
      const k = key as PetStatName
      let change = 0

      switch (this.statData[k].action) {
        case "deplete":
          change = -this.statData[k].depleteRate
          this.stats[k] = clamp(this.stats[k] + change, 0, 1)
          break
        case "restore":
          change = +this.statData[k].restoreRate
          this.stats[k] = clamp(this.stats[k] + change, 0, 1)
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
    this.state.needsCleaning = this.objects.droppings.length > 0
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
        depleteRate: 1 / (HOUR * 6), // 6h to empty
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
        onFull: () => this.createDropping(),
        onEmpty: () => (this.state.usingBladder = true),
      },
    }
  }

  get status(): string {
    if (this.state.sleeping) return "Zzz"
    if (this.state.eating) return "Eating"
    if (this.state.needsCleaning) return "Dirty"
  }

  createDropping() {
    this.state.usingBladder = false
    this.createObject("droppings", {
      x: random(0.1, 0.9, true),
      y: 0,
    })
  }

  cleanDroppings() {
    this.objects.droppings = []
    this.state.needsCleaning = false
  }

  createObject<T extends Coords>(key: keyof typeof this.objects, data: T) {
    this.objects[key].push({
      id: uniqueId(),
      ...data,
    })
  }
  removeObject(key: keyof typeof this.objects, id: string) {
    this.objects[key] = this.objects[key].filter((i) => i.id !== id)
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
