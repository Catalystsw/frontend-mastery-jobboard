// #note rafSchedule — throttle by frame instead of by clock.
// #note A scroll handler can fire many times between two frames. Anything it does to the
// #note page more than once per frame is thrown away, because only one frame gets painted.
// #note This is the frame-aligned answer to module 2, lesson 9: one call per frame, with
// #note the latest arguments, cancelled cleanly on teardown.

export interface Scheduled<Args extends unknown[]> {
  (...args: Args): void
  /** Drop a frame that has been requested but not yet run. Call this on unmount. */
  cancel(): void
}

export interface RafSchedulerOptions {
  /** Injected so the tests can drive frames by hand. Defaults to the real thing. */
  requestFrame?: (callback: () => void) => number
  cancelFrame?: (handle: number) => void
}

export function rafSchedule<Args extends unknown[]>(
  fn: (...args: Args) => void,
  options: RafSchedulerOptions = {},
): Scheduled<Args> {
  const requestFrame =
    options.requestFrame ?? ((callback: () => void) => requestAnimationFrame(callback))
  const cancelFrame = options.cancelFrame ?? ((handle: number) => cancelAnimationFrame(handle))

  // #hint 1 You need two pieces of state: the handle of the frame you asked for, and the latest arguments.
  // #hint 2 Every call stores its arguments. Only ask for a frame when none is pending — requesting one per call is the bug this function exists to remove.
  // #hint 3 Inside the frame callback, forget the handle first, then call `fn` with the stored arguments. The next call can then ask for a new frame.
  // #hint 4 `cancel()` hands the handle to `cancelFrame` and forgets it.
  // #region solution
  let frame: number | undefined
  let latestArgs: Args | undefined

  const scheduled = ((...args: Args) => {
    latestArgs = args
    if (frame !== undefined) return

    frame = requestFrame(() => {
      frame = undefined
      if (latestArgs) fn(...latestArgs)
    })
  }) as Scheduled<Args>

  scheduled.cancel = () => {
    if (frame !== undefined) cancelFrame(frame)
    frame = undefined
  }

  return scheduled
  // #endregion
}
