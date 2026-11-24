import type { SeniorityLevel } from '@/domain'
import { EMPLOYERS } from '@/data/fixtures/employers'
import { SENIORITY_LABEL } from '../../format'
import { NO_FILTERS, hasActiveFilters, type FeedFilters } from './feed-filters'

const SENIORITIES: SeniorityLevel[] = ['junior', 'mid', 'senior', 'staff']

interface Props {
  filters: FeedFilters
  onChange: (filters: FeedFilters) => void
}

export function FilterBar({ filters, onChange }: Props) {
  return (
    <aside className="filters filter-bar" aria-label="Filters">
      <div className="filters-head">
        <h2>Filters</h2>
        {hasActiveFilters(filters) && (
          <button type="button" className="link-button" onClick={() => onChange(NO_FILTERS)}>
            Clear filters
          </button>
        )}
      </div>

      <label className="check">
        <input
          type="checkbox"
          checked={filters.remoteOnly}
          onChange={(event) => onChange({ ...filters, remoteOnly: event.target.checked })}
        />
        <span>Remote only</span>
      </label>

      <label className="select-field">
        <span>Seniority</span>
        <select
          value={filters.seniority ?? ''}
          onChange={(event) =>
            onChange({
              ...filters,
              seniority: SENIORITIES.find((level) => level === event.target.value) ?? null,
            })
          }
        >
          <option value="">Any level</option>
          {SENIORITIES.map((level) => (
            <option key={level} value={level}>
              {SENIORITY_LABEL[level]}
            </option>
          ))}
        </select>
      </label>

      <label className="select-field">
        <span>Company</span>
        <select
          value={filters.employerId ?? ''}
          onChange={(event) => onChange({ ...filters, employerId: event.target.value || null })}
        >
          <option value="">Any company</option>
          {EMPLOYERS.map((employer) => (
            <option key={employer.id} value={employer.id}>
              {employer.name}
            </option>
          ))}
        </select>
      </label>
    </aside>
  )
}
