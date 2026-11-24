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
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<FeedFilters>(NO_FILTERS)
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
