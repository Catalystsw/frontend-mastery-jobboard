# Stage module-5/feed-ui — the listings feed

**Module 5 · React, Deeply — lesson 9, Build the listings feed, profile it, fix it**

The job board's listings feed: search by title or company, filter by remote, seniority and
company, save a listing and watch the header's count go up, over 300 listings. It is built the
obvious way, with every piece of state in `FeedPage`. That is not a trap for its own sake: it is
the shape most production feeds start in, and it gives the profiler something to find.

This stage is a refactor. The page already works, and it still works the same way when you are
done. What changes is **which components render when you type.**

## The page

```
FeedPage                  query · filters · savedIds
├── FeedHeader            the saved count
│   └── SavedCount
├── FilterBar             remote · seniority · company
├── SearchBox             onSearch={setQuery}
├── ListingResults        filters the listings in render
│   └── ListingCard × 300
└── CompanySidebar        who is hiring
```

All of it lives in `src/features/jobs/components/feed/`. `pnpm dev` opens on the feed; the
search-and-detail board from the autocomplete stage is at `/board`.

## What you do

| # | Step | What it looks like |
|---|---|---|
| 1 | **Read the naive build** | `feed-page.tsx`: the query, the filters and the saved ids all live in `FeedPage`. |
| 2 | **Predict** | Before you open the profiler, write down which components re-render on one keystroke, and which on one save. Lessons 2 and 8 are enough to get it exactly right. |
| 3 | **Profile** | React DevTools, the steps below. Check your prediction against the tool. |
| 4 | **Move the state down** | The query goes to the only components that use it. No `memo`. |
| 5 | **Profile again** | The same five keystrokes. Compare the two flamegraphs. |

## Profiling it

Install [React Developer Tools](https://react.dev/learn/react-developer-tools), run `pnpm dev`
and open the feed. Profile the dev server, not `pnpm build`: the production build leaves the
profiler out.

| Step | Where |
|---|---|
| Highlight updates | DevTools settings → **General** → "Highlight updates when components render" |
| Record why each rendered | DevTools settings → **Profiler** → "Record why each component rendered while profiling" |
| Record, type five letters, stop | the **Profiler** tab: ● record, type `react` into the search box, ■ stop |
| Read the flamegraph | grey: did not render · yellow: slow · click a bar to see why it rendered |

What you should find on `start`: about one commit per keystroke, and in every one of them
`FeedHeader` and `CompanySidebar` render, with the reason **"The parent component rendered."**
Neither shows anything that depends on the query, and `FilterBar` renders for the same reason.
`ListingResults` is the widest bar, with its cards under it. After the fix, a keystroke renders
the search box, the results and the cards, and everything else is grey.

## Working through it

```bash
git checkout module-5/feed-ui/start
pnpm install
pnpm dev               # the feed, built the obvious way
pnpm test:watch        # one red test: the profiler's finding, written down
```

12 tests describe the feed. Eleven of them (the data, search, filters and saving) pass before
your change and still pass after it. That is the point of a refactor: they are your proof that
nothing broke. One is red: it counts renders the way the profiler does, and passes only when a
keystroke stops rendering the header and the sidebar.

Stuck? `git checkout module-5/feed-ui/guided -- src/features/jobs/components/feed/feed-page.tsx`

## Acceptance

- `pnpm test` all green: 12 here, plus the 47 utility and autocomplete tests already on the branch
- `pnpm typecheck` and `pnpm lint` clean
- No `memo`, `useMemo` or `useCallback` added. The fix is where the state lives
- Re-profiled with the same five keystrokes: `FeedHeader` and `CompanySidebar` are grey

## Deliverable

The fixed feed on a branch off `module-5/feed-ui/start`, in a PR with two flamegraph
screenshots: one recorded before the change and one after, the same five keystrokes each time.

## Where it goes

Moving state down is the second rung of the fix order this module teaches: derive, move state
down, pass children, split context, and memo last. Module 6 moves the filters into the URL, and
module 8 measures the list again against a budget. A keystroke still renders 300 cards after this
fix, and that is a different problem with a different tool.
