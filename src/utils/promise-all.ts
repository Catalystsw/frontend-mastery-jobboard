// promiseAll — reimplement Promise.all. The classic "do you actually understand promises"
// question. Order of results must match input order even though they settle out of order.

export function promiseAll<T>(values: readonly (T | Promise<T>)[]): Promise<T[]> {
  // TODO 1: Return a `new Promise((resolve, reject) => ...)` — you decide when it resolves.
  // TODO 2: Put each result in its own slot: `results[index] = value`. Pushing as they arrive gives you completion order, which is the wrong answer.
  // TODO 3: Keep a counter of how many have finished. When it reaches `values.length`, resolve with `results`.
  // TODO 4: An empty input has nothing to wait for: no `.then` ever runs, so nothing would ever call `resolve`. Resolve `[]` straight away.
  // TODO 5: `Promise.resolve(value)` turns a plain value into a promise, so one code path handles both. Pass `reject` as the error handler — the first rejection wins.
  throw new Error('Not implemented')
}
