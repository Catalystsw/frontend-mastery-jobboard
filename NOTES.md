# `module-5/feed-ui` — the trade-offs

You are reading this on the `solution` branch. It is the conversation that comes *after* the
fix: why the state ended up where it did, and where an interviewer pushes.

The whole fix is one new component:

```tsx
function SearchableListings({ filters, listings, savedIds, onToggleSave }) {
  const [query, setQuery] = useState('')
  return (
    <>
      <SearchBox onSearch={setQuery} />
      <ListingResults query={query} filters={filters} listings={listings} ... />
    </>
  )
}
```

`FeedPage` renders `<SearchableListings />` where the search box and the results used to be. A
keystroke now renders `SearchableListings`, `SearchBox`, `ListingResults` and the cards, and
`FeedHeader` and `CompanySidebar` go grey in the profiler. Nothing is memoised.

---

## Where each piece of state lives, and why

**The rule: state lives in the lowest component that contains everything that uses it.**

| State | Used by | Lives in | Why |
|---|---|---|---|
| `query` | `SearchBox` (writes), `ListingResults` (reads) | `SearchableListings` | The two are siblings, so their own small parent owns it. Nothing else on the page reads it. |
| `savedIds` | `FeedHeader` (the count), every `ListingCard` (its button) | `FeedPage` | The header and the cards meet only at `FeedPage`. Moving it lower would cut the header off from the count. |
| `filters` | `FilterBar` (writes), `ListingResults` (reads) | `FeedPage` | See below. It could move, and on purpose it doesn't. |

**Why `filters` stays in `FeedPage`.** By the rule above, filters could move down too:
only `FilterBar` and `ListingResults` use them. Two reasons they don't, in this lesson:

1. **Profile first, then fix.** The profiler flagged the keystrokes: five commits in a second,
   each rendering two components for nothing. A filter change is one click and one commit. It
   renders the header and the sidebar too, and nobody can feel it. Fixing what you measured is
   the habit; fixing everything the rule allows is how a refactor grows.
2. **Module 6 moves the filters into the URL.** Once they are URL state, the router owns them,
   and the question of which component holds them goes away. Moving them now would be work to
   undo next module.

If an interviewer asks you to move them anyway, it is the same move with one catch: `FilterBar`
sits in the left column and `SearchableListings` in the middle one, so whatever owns the filters
has to contain both columns, or take the bar in as an element. That catch is the next rung,
passing children.

**Why `savedIds` is not in context.** Two consumers, one level apart, is props territory. Context
would make every consumer render on every save. That is the same set it renders now, so context
buys nothing until the count shows up in components far away from the cards.

---

## What an interviewer pushes on

> "Why not just wrap `FeedHeader` and `CompanySidebar` in `memo`?"

It works today, because `FeedHeader` takes a single number. It is also fragile: the day someone
passes it an inline callback or a fresh object, the memo stops skipping, and nothing tells you.
Moving the state removes the render instead of skipping it, and costs nothing at runtime. Memo is
the last rung, for when the state genuinely has to stay high.

> "And `useCallback` on `toggleSave`?"

Nothing receiving it is memoised, so a stable reference changes nothing. `useCallback` only pays
when the child is behind `memo` or the function is an effect dependency. Neither is true here.

> "Doesn't the React Compiler make this whole lesson moot?"

It automates most of the memo rung. It does not decide where state belongs, so it cannot move the
query into `SearchableListings` for you. And a compiled `FeedPage` still runs on every keystroke.

> "A keystroke still renders 300 cards. Isn't that the real cost?"

Yes, and it is a different problem. The results genuinely depend on the query, so they have to
render. The tools for that are `useDeferredValue` (keep the input responsive while the list
catches up) and windowing (`ui/virtual-list` renders only the visible cards). Both are worth
naming, and neither is a substitute for putting the state in the right place first.

> "Would you debounce the search?"

Not here. Filtering 300 items in memory takes well under a millisecond; the cost is rendering the
cards, and a debounce only hides it by making the list feel late. When each keystroke costs a
request, as in the autocomplete stage, debounce it.

> "How do you know the fix didn't break anything?"

Eleven tests passed before the change and pass after it: the data, search, filters and saving.
A refactor is the change where those tests earn their keep. The render test counts renders the
way the profiler does, so the fix cannot quietly regress either.
