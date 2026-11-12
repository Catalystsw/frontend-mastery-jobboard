# Stage module-3/utils — the interview utility library

**Module 3 · JavaScript, Deeply**

Four functions that get asked in real interviews more often than anything else on the frontend.
You're not using them from a library here — you're writing them, with the tests an interviewer
would write first. Each one is the core version: get it right, then read `NOTES.md` on the
solution branch for the follow-ups an interviewer adds once it works.

## What you implement

| File | Function | The follow-up question you should expect |
|---|---|---|
| `src/utils/debounce.ts` | `debounce(fn, wait)` + `cancel` | "How would you add `flush`?" · "What happens to `this`?" |
| `src/utils/throttle.ts` | `throttle(fn, wait)` + `cancel` | "How is this different from debounce?" · "Which one for infinite scroll?" |
| `src/utils/deep-clone.ts` | `deepClone(value)` — objects, arrays, Dates, cycles | "Why not `JSON.parse(JSON.stringify(x))`?" · "Now add Map and Set" |
| `src/utils/event-emitter.ts` | `EventEmitter` — `on` / `once` / `off` / `emit` | "What if a listener unsubscribes during emit?" |

## Where it goes in the product

These aren't exercises in a vacuum — the job board uses all of them:

- `debounce` → the search box in module 5's autocomplete
- `throttle` → the infinite-scroll handler on the listings feed
- `deepClone` → resetting filters to their last saved state
- `EventEmitter` → the toast system in module 5

## Working through it

```bash
git checkout module-3/utils/start
pnpm install
pnpm test:watch        # red, 42 failing
```

27 of those are yours, in `src/utils`. The other 15 are the search box, which imports your
`debounce` — they go green on their own the moment `debounce` works.

Implement one file at a time. A good order is `debounce` → `throttle` → `EventEmitter` →
`deepClone`. Inside each file the tests go from the obvious case to the one that catches
people out.

Stuck on a specific function? Pull only its hints:

```bash
git checkout module-3/utils/guided -- src/utils/debounce.ts
```

Done? Compare, don't just check:

```bash
git diff module-3/utils/solution -- src/utils/
```

## Acceptance

- `pnpm test` — all green: 27 in `src/utils`, plus the search box's 15
- `pnpm typecheck` — clean, with `strict` on
- No `any`, no `@ts-expect-error`
