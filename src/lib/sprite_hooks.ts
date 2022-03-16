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

  useAnimationFrame(doDraw)
}

export function useAnimationFrame(cb: () => void) {
  const { frame } = useTick()

  React.useLayoutEffect(() => {
    let animationFrameId: number

    const render = () => {
      cb()
      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [frame, cb])
}

export function useSprite({
  image,
  ctx,
  width,
  height,
  padding,
  frameCount,
  spriteSize,
  speed,
}: {
  ctx: CanvasRenderingContext2D
  image: HTMLImageElement
  width: number
  height: number
  padding: number
  frameCount: number
  spriteSize: number
  speed: number
}) {
  const { frame } = useTick()
  const objectAnimFrame = React.useMemo(() => Math.floor(frame / speed) % frameCount, [frame])

  useCanvas(
    ctx,
    (ctx) => {
      ctx.drawImage(
        image,
        objectAnimFrame * spriteSize, // source x
        0, // source y
        spriteSize, // source w
        spriteSize, // source h
        padding, // dest x
        padding, // dest y
        width - padding * 2, // dest w
        height - padding * 2 // dest h
      )
    },
    { width, height }
  )
}
