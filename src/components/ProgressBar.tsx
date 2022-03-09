import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import React from "react"

const HEIGHT = 24

export const ProgressBar: React.FC<{
  value: number
  bg: string
  fg: string
  textColor: string
  label?: React.ReactNode | ((perc: number) => React.ReactNode)
  showPerc?: boolean
}> = ({
  value,
  bg,
  fg,
  textColor,
  label = (p) => `${p.toFixed(2)}%`,
  showPerc = true,
  ...props
}) => {
  const perc = value * 100
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="caption" textAlign="center" component="p">
        {typeof label === "function" ? label(perc) : label}
      </Typography>
      <Box sx={{ backgroundColor: bg, height: HEIGHT, borderRadius: 1, position: "relative" }}>
        <Box
          sx={{
            borderRadius: 1,
            width: `${perc.toFixed(2)}%`,
            backgroundColor: fg,
            height: HEIGHT,
            color: textColor,
            overflow: "visible",
          }}
        />
        {showPerc ? (
          <Typography
            variant="caption"
            color={textColor}
            textAlign="center"
            component="p"
            sx={{
              lineHeight: `${HEIGHT}px`,
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            {perc.toFixed(2)}%
          </Typography>
        ) : null}
      </Box>
    </Box>
  )
}
