import { Coords } from "./types"
export function addPositions(pos1: Coords, pos2: Coords): Coords {
  return { x: pos1.x + pos2.x, y: pos1.y + pos2.y }
}
export function subtractPositions(pos1: Coords, pos2: Coords): Coords {
  return { x: pos1.x - pos2.x, y: pos1.y - pos2.y }
}

export function scalePosition(pos: Coords, scale: number | Coords): Coords {
  return {
    x: pos.x * (typeof scale === "number" ? scale : scale.x),
    y: pos.y * (typeof scale === "number" ? scale : scale.y),
  }
}
