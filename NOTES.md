# `module-3/utils` — the trade-offs

You are reading this on the `solution` branch. It is the conversation that comes *after*
green tests: why each utility is shaped the way it is, what it costs, and where an
interviewer pushes.

These five are the most-asked functions in frontend interviews. Passing the tests is the
easy half. Being able to defend a line while you type it is the half that gets scored.

---

## `debounce`

**The trade-off: responsiveness against work.** Every millisecond of `wait` is a
millisecond the user stares at a stale screen. Too short and you are back to a request per
keystroke; too long and the box feels broken. 250–400ms is the range for search input, and
you should be able to say why you picked your number.

**Decisions in this implementation**

- **Trailing edge only.** For a search box, the last thing typed is the only query worth
  sending.
- The timer id lives in the closure, not on the returned function. That is what lets one
  call cancel the previous one, and it is the whole mechanism.
- The newest arguments win without any bookkeeping: each call hands `setTimeout` a new
  arrow that closes over that call's `args`, and clearing the old timer throws the old
  arrow away.
- `cancel()` for unmount. Most submitted answers ship without it, and the first follow-up
  is always "what happens when the component goes away?"

**What an interviewer pushes on**

> "What happens on unmount?"

A pending timer fires into a dead component. Return `cancel` and call it in cleanup.

> "Add `flush()`."

"The user pressed Enter — send it now." Keep the pending arguments in a variable instead of
only inside the timer's arrow, so `flush` can clear the timer and run them straight away.

> "What happens to `this`?"

This version uses arrows, so `debounce(obj.method)` loses its receiver. The fix is a normal
`function` for the returned wrapper and `fn.apply(this, args)` — module 3, lesson 3, cashed
in.

> "Does this fix the race condition?"

**No** — and this is the answer that separates people. Debounce reduces the *number* of
requests. Two that do go out can still come back out of order, and the stale one can win.
That needs an `AbortController` or a request id, which is module 7's autocomplete.

---

## `throttle`

**The trade-off: which edges you keep.** Leading-only feels instant and drops the final
state. Trailing-only is accurate and feels laggy. Both is usually right and costs you the
stored arguments.

Say which pair you chose and what the user would feel if you chose the other.

**Decisions in this implementation**

- Both edges, always. The first call runs at once; the last call made during a window runs
  when the window closes, so the final scroll position is never lost.
- The timer **is** the window. While it is set, calls only store their arguments. No
  timestamps, no arithmetic — which is why this version is short enough to write in an
  interview without an off-by-one.
- The trailing call goes back through `throttled` itself, so it opens the next window the
  same way any leading call does. One code path, not two.
- One timer per window, not one per call. Scheduling per call is the bug the function
  exists to prevent.

**What an interviewer pushes on**

> "Make the edges configurable — `{ leading, trailing }`."

`trailing: false` is easy: stop storing arguments. `leading: false` is the one that breaks
implementations — the first call must *not* run immediately, it has to open a window and
wait. Lodash does it with timestamps (`Date.now() - lastInvokedAt`), which is the version
to reach for once options arrive.

> "Debounce or throttle here?"

Wait for quiet → debounce. Guarantee a rate → throttle. Say the sentence, then name the
case: search input is debounce, scroll position is throttle.

> "Why not `requestAnimationFrame`?"

For anything that paints per frame — scroll, drag, mousemove — rAF *is* the better
throttle, because it is aligned to the frame instead of to a wall-clock guess. That is
`rafSchedule` in `module-2/browser-lab`.

---

## `deepClone`

**The trade-off: correctness against surface area.** A complete deep clone is not a
twenty-line function — it is a long tail of exotic objects. This version handles the ones
that turn up in application data and stops there, on purpose.

**Decisions in this implementation**

- The `WeakMap` is set **before** recursing. Set it after and a circular reference
  recurses forever. This is the single most-marked line in the function.
- `WeakMap`, not `Map`, so the bookkeeping cannot outlive the objects it describes.
- `Date` is handled explicitly. Spread it and you get `{}` — silently, with no error, which
  is how this bug reaches production.
- Arrays are checked before plain objects, so an array comes back as an array and not as
  an object with numeric keys.
- `Object.entries` copies the own enumerable string keys. Symbols, non-enumerable
  properties and the prototype are left behind — deliberately, since filter state and API
  data never carry them.
- Functions are returned by reference, not cloned. Cloning a function is not meaningful
  in JavaScript, and pretending otherwise is worse than the sharing.
- **Recursive**, which means a deep enough tree overflows the stack. The queue-based
  version is the follow-up answer, not the first draft.

**What an interviewer pushes on**

> "Now add `Map` and `Set`."

Two more branches, shaped exactly like the array one: create the empty `Map`/`Set`, record
it in `seen`, then copy each entry through `deepClone`. For a `Map`, clone the keys too.

> "Why not `JSON.parse(JSON.stringify(x))`?"

Three failures in ten seconds: a `Date` becomes a string, `undefined` and functions
disappear, and a cycle throws.

> "Why not `structuredClone`?"

In production, use it — it is built in, handles cycles, `Map`, `Set` and typed arrays. You
write this one to prove you know what it is doing, and because `structuredClone` throws on
functions and DOM nodes, which is sometimes exactly the case you have.

---

## `EventEmitter`

**The trade-off: decoupling against traceability.** Events make the publisher and the
subscriber independent, and they make "what happens when I click this" unanswerable
without a search. Use them across a boundary you actually want loose, not as a general
way to call functions.

**Decisions in this implementation**

- `on()` **returns an unsubscribe**. This is the senior touch and the one interviewers look
  for: cleanup that cannot be forgotten, because you were handed it rather than told to
  reconstruct it.
- A `Map` of `Set`s. The `Set` means registering the same listener twice is a no-op —
  arguably wrong if you want duplicates, and right for every real use of this class.
- The event's entry is **deleted** when its last listener leaves. Otherwise the map grows
  with empty sets forever, which is module 3, lesson 8, in miniature.
- `emit` walks a **copy** of the set. A listener that unsubscribes — or subscribes another
  listener — during emit would otherwise be changing the collection being iterated.
- `listenerCount` is given. It exists so the tests can see whether `on`/`off`/`once` keep
  the store tidy, not as part of the exercise.
- Typed by an `Events` record, so `emit('job:selected', payload)` is checked against the
  payload the event declares. An untyped emitter is a stringly-typed API.
- `#listeners` is genuinely private. No convention, no underscore, no way to reach it from
  outside.

**What an interviewer pushes on**

> "What if a listener throws?"

In this version it stops the rest of the emit. Say so, and say the alternative: wrap each
call in try/catch and report, at the cost of hiding real errors. Both are defensible;
having no opinion is not.

> "Where is the leak?"

A listener that closes over a component and is never removed. The emitter holds the
listener, the listener holds the closure, the closure holds the tree. This is the #1 SPA
leak, and the returned unsubscribe is the fix.

---

## `promiseAll`

**The trade-off: what failure should mean.** `all` fails the whole screen on one bad
endpoint. `allSettled` renders what it can. Neither is more correct — the right one
depends on whether the page is meaningful with a hole in it.

**Decisions in this implementation**

- Results go into a **pre-sized array by index**. Pushing as they resolve returns
  completion order, which is the wrong answer and the reason the question is asked.
- A `finished` counter rather than `results.length`. The array is pre-sized, so its length
  is already full on the first line — and a slot holding `undefined` looks exactly like an
  empty one, so counting filled slots lies too.
- The empty array resolves immediately, handled **before** the loop. With nothing to
  finish, no `.then` ever runs, so nothing ever calls `resolve` and the promise hangs
  forever.
- A plain `T[]` signature. The real `Promise.all` keeps a separate type per slot (a tuple);
  that typing is a TypeScript exercise, not a promises one, and module 4 is where it
  belongs.
- `Promise.resolve(value)` normalises non-promise inputs in one line — the real
  `Promise.all` accepts any iterable of values.
- `reject` is passed straight through as the rejection handler. A promise settles once, so
  no guard flag is needed; adding one signals you do not trust the primitive.

**What an interviewer pushes on**

> "Does the first rejection cancel the others?"

**No.** They keep running and their results are discarded. Cancellation is
`AbortController`, and it is a separate decision from combination.

> "Now write `allSettled`."

Same skeleton, one changed settle condition: never reject, and store
`{ status, value | reason }` per slot. If you built `promiseAll` with a counter, this is a
three-line edit — which is the point of building it with a counter.

---

## The thing this stage is really teaching

None of these five needed anything you had not already seen by lesson 8. `debounce` is a
closure with a timer. `EventEmitter` is a `Map` and an unsubscribe. `promiseAll` is a
counter and an index.

You can write them from an empty file because you spent eight lessons on the mechanics
instead of memorising the snippets — and that is exactly the difference the interview is
built to detect.
