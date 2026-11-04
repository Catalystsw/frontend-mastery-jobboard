// debounce — delays the call until `wait` ms have passed with no further calls.
// On the job board this drives the search box: type "seni", "senio", "senior" and only
// the last one hits the network. Asked in interviews more than any other utility.

export interface Debounced<Args extends unknown[]> {
  (...args: Args): void
  /** Drop a pending call. */
  cancel(): void
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): Debounced<Args> {
  // TODO 1: Keep one timer id in the closure — declared outside the returned function, so every call sees the same variable.
  // TODO 2: On each call, clear the previous timer and start a new one. That single move is the whole of debounce.
  // TODO 3: The arrow you hand to setTimeout closes over this call's `args`, so the newest call's arguments are the ones that run.
  // TODO 4: `cancel` clears the timer. Calling `clearTimeout(undefined)` is allowed, so you do not need an if.
  throw new Error('Not implemented')
}
