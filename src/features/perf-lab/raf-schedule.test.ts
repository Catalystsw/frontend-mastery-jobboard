import { describe, expect, it, vi } from 'vitest'
import { rafSchedule } from './raf-schedule'

/** A hand-cranked frame loop, so a test can decide exactly when a frame happens. */
function fakeFrames() {
  const queue = new Map<number, () => void>()
  let nextHandle = 1

  return {
    requestFrame: (callback: () => void) => {
      const handle = nextHandle++
      queue.set(handle, callback)
      return handle
    },
    cancelFrame: (handle: number) => {
      queue.delete(handle)
    },
    /** Run every callback queued for the next frame. */
    tick() {
      const due = [...queue.values()]
      queue.clear()
      due.forEach((callback) => callback())
    },
    get pending() {
      return queue.size
    },
  }
}

describe('rafSchedule', () => {
  it('does not run the handler until a frame arrives', () => {
    const frames = fakeFrames()
    const spy = vi.fn()

    rafSchedule(spy, frames)()

    expect(spy).not.toHaveBeenCalled()
    frames.tick()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('collapses many calls in one frame into a single run', () => {
    const frames = fakeFrames()
    const spy = vi.fn()
    const onScroll = rafSchedule(spy, frames)

    for (let i = 0; i < 50; i++) onScroll()
    frames.tick()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('requests one frame, not one per call', () => {
    const frames = fakeFrames()
    const onScroll = rafSchedule(vi.fn(), frames)

    onScroll()
    onScroll()
    onScroll()

    expect(frames.pending).toBe(1)
  })

  it('runs with the newest arguments, not the oldest', () => {
    const frames = fakeFrames()
    const spy = vi.fn<(scrollTop: number) => void>()
    const onScroll = rafSchedule(spy, frames)

    onScroll(0)
    onScroll(400)
    onScroll(1200)
    frames.tick()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(1200)
  })

  it('schedules again on the next frame', () => {
    const frames = fakeFrames()
    const spy = vi.fn()
    const onScroll = rafSchedule(spy, frames)

    onScroll()
    frames.tick()
    onScroll()
    frames.tick()

    expect(spy).toHaveBeenCalledTimes(2)
  })

  it('cancel() drops a frame that has been requested but not run', () => {
    const frames = fakeFrames()
    const spy = vi.fn()
    const onScroll = rafSchedule(spy, frames)

    onScroll()
    onScroll.cancel()
    frames.tick()

    expect(spy).not.toHaveBeenCalled()
    expect(frames.pending).toBe(0)
  })
})
