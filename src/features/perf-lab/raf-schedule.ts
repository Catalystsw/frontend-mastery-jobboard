// rafSchedule — throttle by frame instead of by clock.
// A scroll handler can fire many times between two frames. Anything it does to the
// page more than once per frame is thrown away, because only one frame gets painted.
// This is the frame-aligned answer to module 2, lesson 9: one call per frame, with
// the latest arguments, cancelled cleanly on teardown.

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

  // TODO 1: You need two pieces of state: the handle of the frame you asked for, and the latest arguments.
  // TODO 2: Every call stores its arguments. Only ask for a frame when none is pending — requesting one per call is the bug this function exists to remove.
  // TODO 3: Inside the frame callback, forget the handle first, then call `fn` with the stored arguments. The next call can then ask for a new frame.
  // TODO 4: `cancel()` hands the handle to `cancelFrame` and forgets it.
  throw new Error('Not implemented')
}
