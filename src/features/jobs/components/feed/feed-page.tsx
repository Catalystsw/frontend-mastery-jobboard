// The listings feed: search by title or company, filter by remote, seniority and company, save a
// listing, and 300 listings to do it over. Enough weight for the React DevTools profiler to find
// something. STAGE.md has the brief.

import { useState } from 'react'
import type { Job } from '@/domain'
import { LISTINGS } from '@/data/fixtures/listings'
import { CompanySidebar } from './company-sidebar'
import { FeedHeader } from './feed-header'
import { NO_FILTERS, type FeedFilters } from './feed-filters'
import { FilterBar } from './filter-bar'
import { ListingResults } from './listing-results'
import { SearchBox } from './search-box'

interface Props {
  /** Defaults to the 300 fixture listings. The tests pass a handful. */
  listings?: Job[]
}

export function FeedPage({ listings = LISTINGS }: Props) {
  // TODO 1: Predict before you measure. Write down which components re-render when you type one letter, and which when you save a listing. Then turn on React DevTools → settings → General → "Highlight updates when components render", and type.
  // TODO 2: Profile it. Settings → Profiler → "Record why each component rendered while profiling". Record, type five letters, stop. Click FeedHeader and CompanySidebar in each commit and read why they rendered. Neither shows anything that depends on the query.
  // TODO 3: Who uses `query`? SearchBox sets it and ListingResults reads it, nothing else. When state changes, its owner re-renders everything it renders, so the owner should be the smallest component that contains both.
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<FeedFilters>(NO_FILTERS)
  // TODO 4: savedIds stays where it is. FeedHeader shows the count and every ListingCard shows its own state, and FeedPage is the closest parent the two share.
  const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(() => new Set())

  const toggleSave = (listingId: string) =>
    setSavedIds((current) => {
      const next = new Set(current)
      if (next.has(listingId)) next.delete(listingId)
      else next.add(listingId)
      return next
    })

  return (
    <div className="shell">
      <div className="glow" aria-hidden="true" />
      <FeedHeader savedCount={savedIds.size} />

      <div className="layout feed-layout">
        <FilterBar filters={filters} onChange={setFilters} />

        <main className="feed-main">
          {/* TODO 5: Move the query down: a new component that owns it and renders these two, rendered here in their place. Leave memo alone. The fix order is derive, move state down, pass children, split context, and memo last. */}
          <SearchBox onSearch={setQuery} />
          <ListingResults
            query={query}
            filters={filters}
            listings={listings}
            savedIds={savedIds}
            onToggleSave={toggleSave}
          />
        </main>

        <CompanySidebar listings={listings} />
      </div>
    </div>
  )
}
