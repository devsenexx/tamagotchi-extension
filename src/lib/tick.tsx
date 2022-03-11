import React from "react"

export type WithTick<T> = T & TickData

export interface TickData {
  frame: number
  delta: number
}

export function useTick(): TickData {
  const [prevTime, setPrevTime] = React.useState(Date.now())
  const [frame, setFrame] = React.useState(0)
  const curTime = Date.now()

  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      setPrevTime(curTime)
      setFrame((f) => f + 1)
    })
    return () => cancelAnimationFrame(id)
  }, [prevTime, curTime])

  const delta = curTime - prevTime
  return { frame, delta }
}

export function withTick<T>(
  Component: React.ComponentType<WithTick<T>>
): React.FC<Omit<T, keyof WithTick<{}>>> {
  return (props: React.PropsWithChildren<Omit<T, keyof WithTick<{}>>>) => {
    const { frame, delta } = useTick()

    const _Component: any = Component

    return <_Component {...props} frame={frame} delta={delta} />
  }
}

export function wake() {
  setTimeout(() => {
    chrome.runtime.sendMessage("ping")
    wake()
  }, 10000)
}
