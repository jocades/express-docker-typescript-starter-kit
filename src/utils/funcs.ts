export function pick<T, K extends keyof T>(obj: T, props: K[]): Pick<T, K> {
  return props.reduce((a, p) => {
    a[p] = obj[p]
    return a
  }, {} as Pick<T, K>)
}
