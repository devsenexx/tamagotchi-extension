import clamp from "lodash/clamp"
import { HOUR, SEC } from "./consts"
import { Coords, SubType } from "./types"
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
export type PetState = "idle" | "sleeping" | "moving" | "eating" | "dropping"

export type PetStats = Record<PetStatName, number>

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
    this.state = state ?? "idle"

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
    return this.state !== "idle"
  }
  get canMove(): boolean {
    return !this.isDoingSomething
  }

  get hasDroppings(): boolean {
    return this.objects.droppings.length > 0
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
  }

  get statKeys(): Array<keyof PetStats> {
    return Object.keys(this.stats) as Array<keyof PetStats>
  }

  async moveRandomly(frameSize: number) {
    const { x, direction } = this.getRandomMovement()

    this.moveTo({ x: x, direction: direction })
  }

  moveTo(newPosition: Partial<Position>) {
    console.log("Moving to:", newPosition)
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
        action: this.state === "eating" ? "restore" : "deplete",
        onFull: () => (this.state = "idle"),
        // onEmpty: () => this.state.sleeping = true,
      },
      energy: {
        depleteRate: 1 / (HOUR * 18), // 18h to empty
        restoreRate: 1 / (HOUR * 6), // 6h to full
        action: this.state === "sleeping" ? "restore" : "deplete",
        onFull: () => (this.state = "idle"),
        onEmpty: () => (this.state = "sleeping"),
      },
      bladder: {
        depleteRate: 1 / (HOUR * 4), // 4h to empty
        restoreRate: 1 / (SEC * 6), // 6s to full
        action: this.state === "dropping" ? "restore" : "deplete",
        onFull: () => this.createDropping(),
        onEmpty: () => (this.state = "dropping"),
      },
    }
  }

  get status(): string {
    switch (this.state) {
      case "sleeping":
        return "Zzz"
      case "eating":
        return "Eating"
      default:
        if (this.hasDroppings) {
          return "Dirty"
        }
    }
  }

  createDropping() {
    this.state = "idle"
    this.createObject("droppings", {
      x: this.position.x,
      y: 0,
    })
  }

  cleanDroppings() {
    this.objects.droppings = []
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

  getRandomMovement() {
    const MOVE_MIN = 0.03
    const MOVE_MAX = 0.06
    const X_MIN = 0
    const X_MAX = 0.98
    const absMoveAmount = random(MOVE_MIN, MOVE_MAX, true)

    let actualMoveAmount = this.position.direction === "left" ? -absMoveAmount : absMoveAmount
    let newDirection = this.position.direction

    if (this.position.x + actualMoveAmount > X_MAX || this.position.x + actualMoveAmount < X_MIN) {
      actualMoveAmount *= -1
      newDirection = this.position.direction === "left" ? "right" : "left"
    }

    const actualX = clamp(this.position.x + actualMoveAmount, X_MIN, X_MAX)

    return { x: actualX, direction: newDirection }
  }
}

function fullStats(): PetStats {
  return {
    hunger: 1,
    energy: 1,
    bladder: 1,
  }
}
