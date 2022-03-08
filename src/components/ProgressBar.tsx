import React from "react"

const HEIGHT = 24

export const ProgressBar: React.FC<{ value: number; bg: string; fg: string }> = ({
  value,
  bg,
  fg,
  ...props
}) => {
  return (
    <div style={{ width: "100%", backgroundColor: bg, height: HEIGHT }}>
      <div style={{ width: `${(value * 100).toFixed(2)}%`, backgroundColor: fg, height: HEIGHT }} />
    </div>
  )
}
