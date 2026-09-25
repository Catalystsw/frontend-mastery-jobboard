// promiseAll — reimplement Promise.all. The classic "do you actually understand promises"
// question. Order of results must match input order even though they settle out of order.

export function promiseAll<T>(values: readonly (T | Promise<T>)[]): Promise<T[]> {
  throw new Error('Not implemented')
}
