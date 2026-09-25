// #note throttle — runs at most once per `wait` ms, no matter how often it's called.
// #note Debounce waits for quiet; throttle guarantees a steady rate. On the job board this is
// #note the infinite-scroll handler: fire while the user keeps scrolling, but bounded.
// #note
// #note This version always keeps both edges: the first call runs at once (leading), and the
// #note last call made during a window runs when the window closes (trailing).

export interface Throttled<Args extends unknown[]> {
  (...args: Args): void
  /** Drop a pending trailing call. */
  cancel(): void
}

export function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): Throttled<Args> {
  // #hint 1 Think of a window that opens on a call and closes `wait` ms later. A timer can be that window: while it is set, the window is open.
  // #hint 2 No window open → run `fn` right away and open one. That is the leading edge.
  // #hint 3 Window already open → don't run, just remember the arguments. Keep only the latest ones — each call overwrites the last.
  // #hint 4 When the window closes, if arguments were remembered, run them. Running them through `throttled` again opens a fresh window, which is exactly what you want.
  // #hint 5 `cancel` clears the timer and forgets the remembered arguments.
  // #region solution
  let timer: ReturnType<typeof setTimeout> | undefined
  let pendingArgs: Args | undefined

  const throttled = ((...args: Args) => {
    if (timer !== undefined) {
      pendingArgs = args
      return
    }

    fn(...args)
    timer = setTimeout(closeWindow, wait)
  }) as Throttled<Args>

  const closeWindow = () => {
    timer = undefined
    if (pendingArgs === undefined) return

    const args = pendingArgs
    pendingArgs = undefined
    throttled(...args)
  }

  throttled.cancel = () => {
    clearTimeout(timer)
    timer = undefined
    pendingArgs = undefined
  }

  return throttled
  // #endregion
}
