import React from "react"
import { WithTick, withTick } from "../lib/tick"
import { PetObject } from "../lib/pet_data"
import { useCombinedRefs } from "../lib/combined_refs"
import { useSprite } from "../lib/sprite_hooks"

interface DroppingCanvasProps
  extends WithTick<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>
  > {
  dropping: PetObject
  image: HTMLImageElement
  width: number
  height: number
  padding: number
}

export const DroppingCanvas = withTick(
  React.forwardRef<HTMLCanvasElement, DroppingCanvasProps>(
    ({ dropping, image, frame, delta, width, height, padding, ...props }, ref) => {
      const innerRef = React.useRef(ref)
      const canvasRef = useCombinedRefs(ref, innerRef)

      useSprite({
        ctx: canvasRef.current?.getContext("2d"),
        image: image,
        frameCount: 3,
        spriteSize: 16,
        width,
        height,
        padding,
        speed: 40,
      })

      return (
        <canvas
          ref={canvasRef}
          {...props}
          width={width}
          height={height}
          style={{ background: "transparent" }}
        />
      )
    }
  )
)
