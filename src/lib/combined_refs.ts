import React from "react"

export function useCombinedRefs<T>(
  ...refs: Array<
    | React.Ref<T>
    | React.MutableRefObject<T>
    | React.ForwardedRef<T>
    | React.MutableRefObject<React.ForwardedRef<T>>
  >
) {
  const targetRef = React.useRef<T>()

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === "function") {
        ref(targetRef.current)
      } else {
        const _r: any = ref
        _r.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}
