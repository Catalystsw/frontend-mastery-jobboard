import type { ReactNode } from 'react'
import type { Job } from '@/domain'
import { employerOf } from '@/data/fixtures/employers'
import { LISTINGS_AS_OF } from '@/data/fixtures/listings'
import { SENIORITY_LABEL, WORK_MODE_LABEL, formatPostedAt, formatSalary, initials } from '../../format'

interface Props {
  listing: Job
  query: string
  isSaved: boolean
  onToggleSave: (listingId: string) => void
}

/** Wraps the first case-insensitive match of `query` in a <mark>. */
const highlight = (text: string, query: string): ReactNode => {
  const term = query.trim()
  const at = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1
  if (at === -1) return text
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + term.length)}</mark>
      {text.slice(at + term.length)}
    </>
  )
}

export function ListingCard({ listing, query, isSaved, onToggleSave }: Props) {
  const employer = employerOf(listing)
  const titleId = `listing-${listing.id}`

  return (
    <article className="job-card listing-card" aria-labelledby={titleId}>
      <span className="logo" aria-hidden="true">{initials(employer.name)}</span>

      <div className="job-main">
        <h3 id={titleId} className="job-title">{highlight(listing.title, query)}</h3>
        <p className="job-employer">
          {highlight(employer.name, query)} · {listing.location}
        </p>
        <div className="chips">
          <span className="chip">{WORK_MODE_LABEL[listing.workMode]}</span>
          <span className="chip">{SENIORITY_LABEL[listing.seniority]}</span>
          {listing.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="chip subtle">{skill}</span>
          ))}
        </div>
      </div>

      <div className="job-meta">
        <span className="salary">{formatSalary(listing.salary)}</span>
        <span className="posted">{formatPostedAt(listing, LISTINGS_AS_OF)}</span>
        <button
          type="button"
          className={`save-button${isSaved ? ' is-saved' : ''}`}
          aria-pressed={isSaved}
          onClick={() => onToggleSave(listing.id)}
        >
          <span aria-hidden="true">{isSaved ? '★' : '☆'}</span> Save
        </button>
      </div>
    </article>
  )
}
