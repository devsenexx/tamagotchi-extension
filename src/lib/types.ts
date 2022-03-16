import React from "react"
import { SxProps, Theme } from "@mui/material"

export interface Coords {
  x: number
  y: number
}

export type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}

export type AllowedNames<Base, Condition> = FilterFlags<Base, Condition>[keyof Base]

export type SubType<Base, Condition> = Pick<Base, AllowedNames<Base, Condition>>

export interface Size {
  width: number
  height: number
}

export interface BaseProps {
  sx?: SxProps<Theme>
}

export type HTMLProps<E extends Element> = React.DetailedHTMLProps<React.HTMLAttributes<E>, E>
