import type { Job } from '@/domain'
import { matchesFilters, matchesQuery, type FeedFilters } from './feed-filters'
import { ListingCard } from './listing-card'

interface Props {
  query: string
  filters: FeedFilters
  listings: Job[]
  savedIds: ReadonlySet<string>
  onToggleSave: (listingId: string) => void
}

/** Filters in render — derived, not stored — and renders a card per match. */
export function ListingResults({ query, filters, listings, savedIds, onToggleSave }: Props) {
  const results = listings.filter(
    (listing) => matchesQuery(listing, query) && matchesFilters(listing, filters),
  )
  const term = query.trim()

  return (
    <section className="feed-results" aria-label="Listings">
      <div className="results-head">
        <h1>
          {results.length} {results.length === 1 ? 'role' : 'roles'}
          {term && <span className="results-query"> for “{term}”</span>}
        </h1>
        <div className="sort">Newest first</div>
      </div>

      {results.length === 0 ? (
        <p className="empty">
          <strong>No roles match.</strong>
          <span>Try a company name, or clear a filter.</span>
        </p>
      ) : (
        <ul className="job-list">
          {results.map((listing) => (
            <li key={listing.id}>
              <ListingCard
                listing={listing}
                query={query}
                isSaved={savedIds.has(listing.id)}
                onToggleSave={onToggleSave}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
