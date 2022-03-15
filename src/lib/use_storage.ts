import React from "react"

export function useStorage<T>(
  keys: keyof T | keyof T[],
  { sync }: { sync?: boolean } = { sync: false }
): [T, (value: Partial<T>) => Promise<void>] {
  const [val, setVal] = React.useState<T>({} as T)

  async function getValue(): Promise<void> {
    setVal(
      ((await chrome.storage[sync ? "sync" : "local"].get(keys as string | string[])) ?? {}) as T
    )
  }

  async function updateValue(value: Partial<T>): Promise<void> {
    const promises: Promise<void>[] = []
    promises.push(chrome.storage.local.set(value))
    if (sync) {
      promises.push(chrome.storage[sync ? "sync" : "local"].set(value))
    }
    setVal({ ...val, ...value })
    return Promise.all(promises).then(() => null)
  }

  React.useEffect(() => {
    getValue()
  }, [])

  return [val, updateValue]
}

export function useStorageKey<T>(
  key: string,
  { sync }: { sync?: boolean } = { sync: false }
): [T, (value: T) => Promise<void>] {
  const [val, setVal] = useStorage<Record<typeof key, T>>(key, { sync })

  async function updateVal(value: T): Promise<void> {
    return setVal({ [key]: value } as any)
  }

  return [val[key], updateVal]
}
