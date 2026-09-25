// #note promiseAll — reimplement Promise.all. The classic "do you actually understand promises"
// #note question. Order of results must match input order even though they settle out of order.

export function promiseAll<T>(values: readonly (T | Promise<T>)[]): Promise<T[]> {
  // #hint 1 Return a `new Promise((resolve, reject) => ...)` — you decide when it resolves.
  // #hint 2 Put each result in its own slot: `results[index] = value`. Pushing as they arrive gives you completion order, which is the wrong answer.
  // #hint 3 Keep a counter of how many have finished. When it reaches `values.length`, resolve with `results`.
  // #hint 4 An empty input has nothing to wait for: no `.then` ever runs, so nothing would ever call `resolve`. Resolve `[]` straight away.
  // #hint 5 `Promise.resolve(value)` turns a plain value into a promise, so one code path handles both. Pass `reject` as the error handler — the first rejection wins.
  // #region solution
  return new Promise<T[]>((resolve, reject) => {
    if (values.length === 0) {
      resolve([])
      return
    }

    const results: T[] = new Array<T>(values.length)
    let finished = 0

    values.forEach((value, index) => {
      Promise.resolve(value).then((resolved) => {
        results[index] = resolved
        finished += 1
        if (finished === values.length) resolve(results)
      }, reject)
    })
  })
  // #endregion
}
