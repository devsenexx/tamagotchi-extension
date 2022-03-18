import clamp from "lodash/clamp"
import { HOUR, SEC } from "./consts"
import { Coords, SubType } from "./types"
import random from "lodash/random"
import { uuid } from "../lib/general_utils"

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
  vars: Record<string, any>

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
    vars,
  }: {
    name: string
    sprite: string
    background?: string
    stats?: PetStats
    position?: Position
    state?: PetState
    objects?: Record<"droppings", Array<PetObject>>
    vars?: Record<string, any>
  }) {
    this.name = name
    this.sprite = sprite
    this.background = background

    this.position = { x: 0, y: 0, direction: "left", ...position }
    this.stats = { ...fullStats(), ...stats }
    this.objects = { droppings: [], ...objects }
    this.state = state ?? "idle"
    this.vars = { ...vars }

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
      vars: this.vars,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tick(delta: number) {
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
    const { x, y, direction } = this.getRandomMovement()

    this.moveTo({ x, y, direction: direction })
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
        action:
          this.stats.bladder <= 0 && this.state === "sleeping"
            ? "freeze"
            : this.state === "dropping"
            ? "restore"
            : "deplete",
        onFull: () => this.createDropping(),
        onEmpty: () => {
          if (this.state !== "sleeping") {
            this.state = "dropping"
          }
        },
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
      y: this.position.y,
    })
  }

  cleanDroppings() {
    this.objects.droppings = []
  }
  createObject<T extends Coords>(key: keyof typeof this.objects, data: T) {
    this.objects[key].push({
      id: uuid(),
      ...data,
    })
  }

  removeObject(key: keyof typeof this.objects, id: string) {
    console.log("removing id", id, "from", key)
    this.objects[key] = this.objects[key].filter((i) => i.id !== id)
  }

  getRandomMovement(): Position {
    const MOVE_MIN_X = 0.03
    const MOVE_MIN_Y = 0.001
    const MOVE_MAX_XY = 0.06
    const XY_MIN = 0
    const XY_MAX = 0.98
    const absMoveAmountX = random(MOVE_MIN_X, MOVE_MAX_XY, true)
    const absMoveAmountY = random(MOVE_MIN_Y, MOVE_MAX_XY, true)

    let actualMoveAmountX = this.position.direction === "left" ? -absMoveAmountX : absMoveAmountX
    let actualMoveAmountY = random(0, 1, true) < 0.5 ? -absMoveAmountY : absMoveAmountY
    let newDirection = this.position.direction

    if (
      this.position.x + actualMoveAmountX > XY_MAX ||
      this.position.x + actualMoveAmountX < XY_MIN
    ) {
      actualMoveAmountX *= -1
      newDirection = this.position.direction === "left" ? "right" : "left"
    }

    if (
      this.position.x + actualMoveAmountY > XY_MAX ||
      this.position.x + actualMoveAmountY < XY_MIN
    ) {
      actualMoveAmountY *= -1
    }

    const actualX = clamp(this.position.x + actualMoveAmountX, XY_MIN, XY_MAX)
    const actualY = clamp(this.position.y + actualMoveAmountY, XY_MIN, XY_MAX)

    return { x: actualX, y: actualY, direction: newDirection }
  }
}

function fullStats(): PetStats {
  return {
    hunger: 1,
    energy: 1,
    bladder: 1,
  }
}
