import type { Job } from '@/domain'
import { EMPLOYERS } from '@/data/fixtures/employers'
import { initials } from '../../format'

interface Props {
  listings: Job[]
}

/** Who is hiring, and how many roles each company has open. Nothing in it reads the search. */
export function CompanySidebar({ listings }: Props) {
  const companies = EMPLOYERS.map((employer) => ({
    employer,
    openRoles: listings.filter((listing) => listing.employerId === employer.id).length,
  })).sort((a, b) => b.openRoles - a.openRoles)

  return (
    <aside className="company-sidebar" aria-label="Companies hiring">
      <h2 className="rail-heading">Companies hiring</h2>
      <ul className="company-list">
        {companies.map(({ employer, openRoles }) => (
          <li key={employer.id} className="company-row">
            <span className="logo sm" aria-hidden="true">{initials(employer.name)}</span>
            <span className="company-name">
              <strong>{employer.name}</strong>
              <span>{employer.location}</span>
            </span>
            <span className="company-roles">{openRoles} roles</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
