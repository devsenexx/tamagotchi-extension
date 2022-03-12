import React from "react"
import { useTick } from "./tick"
import { Size } from "./types"

export function useCanvas(
  ctx: CanvasRenderingContext2D | undefined | null,
  draw: (ctx: CanvasRenderingContext2D) => void,
  { width, height }: Size
) {
  const { frame } = useTick()
  const doDraw = React.useCallback(() => {
    if (!ctx) {
      return
    }
    // setup canvas
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, width, height)
    draw(ctx)
  }, [ctx, frame, draw])

  React.useLayoutEffect(() => {
    if (!ctx) {
      return
    }

    let animationFrameId: number

    const render = () => {
      doDraw()
      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [ctx, frame, draw])
}
