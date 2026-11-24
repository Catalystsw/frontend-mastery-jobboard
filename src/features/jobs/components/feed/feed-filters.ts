import type { Job, SeniorityLevel } from '@/domain'
import { employerOf } from '@/data/fixtures/employers'

/** The feed's three filters. `null` means "any". */
export interface FeedFilters {
  remoteOnly: boolean
  seniority: SeniorityLevel | null
  employerId: string | null
}

export const NO_FILTERS: FeedFilters = { remoteOnly: false, seniority: null, employerId: null }

export const hasActiveFilters = (filters: FeedFilters) =>
  filters.remoteOnly || filters.seniority !== null || filters.employerId !== null

/** Search by title or company, case-insensitive. An empty query matches everything. */
export const matchesQuery = (listing: Job, query: string) => {
  const term = query.trim().toLowerCase()
  if (!term) return true
  return (
    listing.title.toLowerCase().includes(term) ||
    employerOf(listing).name.toLowerCase().includes(term)
  )
}

export const matchesFilters = (listing: Job, filters: FeedFilters) =>
  (!filters.remoteOnly || listing.workMode === 'remote') &&
  (filters.seniority === null || listing.seniority === filters.seniority) &&
  (filters.employerId === null || listing.employerId === filters.employerId)
