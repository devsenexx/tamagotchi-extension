import React from "react"
import { usePetSprite } from "../lib/pet_sprite"
import { WithTick, withTick } from "../lib/tick"
import PetData from "../lib/pet_data"
import { useCombinedRefs } from "../lib/combined_refs"

interface PetCanvasProps
  extends WithTick<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>
  > {
  pet: PetData
  width: number
  height: number
  faceDirection: "left" | "right"
  padding: number
  useBackground?: boolean
}

export const PetCanvas = withTick(
  React.forwardRef<HTMLCanvasElement, PetCanvasProps>(
    (
      { pet, frame, delta, width, height, faceDirection, padding, useBackground, ...props },
      ref
    ) => {
      const innerRef = React.useRef(ref)
      const canvasRef = useCombinedRefs(ref, innerRef)

      usePetSprite({
        ctx: canvasRef.current?.getContext("2d"),
        pet,
        width,
        height,
        faceDirection,
        padding,
        useBackground,
      })

      return (
        <canvas
          ref={canvasRef}
          {...props}
          width={width}
          height={height}
          style={{
            background: "transparent",
            transform: faceDirection === "right" ? "scaleX(-1)" : undefined,
          }}
        />
      )
    }
  )
)
