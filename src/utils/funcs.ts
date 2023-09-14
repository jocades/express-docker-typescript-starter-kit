export function pick<T, K extends keyof T>(obj: T, keys: K[]) {
  return keys.reduce((a, k) => {
    a[k] = obj[k]
    return a
  }, {} as Pick<T, K>)
}
