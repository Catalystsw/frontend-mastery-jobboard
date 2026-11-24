import type { Job, SalaryRange, WorkMode } from '@/domain'
import { EMPLOYERS } from './employers'
import { JOBS } from './jobs'

/**
 * The listings feed's data set — 300 listings, the weight the module 5 profiler pass needs.
 *
 * Generated, not random: the same 300 in every test, screenshot and recording. Each listing is
 * one of the twelve hand-written JOBS re-posted by another employer, so titles, skills and
 * salary bands stay realistic; the employer, work mode, salary and posting time vary with the
 * index. Newest first.
 */
export const LISTING_COUNT = 300

/** The moment the data set was captured — "3 days ago" is measured from here, never from now. */
export const LISTINGS_AS_OF = Date.parse('2026-08-25T09:00:00.000Z')

const WORK_MODES: WorkMode[] = ['hybrid', 'remote', 'onsite']
const HOUR = 3_600_000

const pick = <T>(items: readonly T[], index: number): T => {
  const item = items[index % items.length]
  if (item === undefined) throw new Error('pick() from an empty list')
  return item
}

/** ±10% in 5% steps, rounded to the nearest 500, so no two re-posts quote the same band. */
const vary = (salary: SalaryRange | null, index: number): SalaryRange | null => {
  if (!salary) return null
  const factor = 0.9 + ((index * 7) % 5) * 0.05
  const round = (value: number) => Math.round((value * factor) / 500) * 500
  return { ...salary, min: round(salary.min), max: round(salary.max) }
}

const buildListing = (index: number): Job => {
  const job = pick(JOBS, index)
  // A second stride over the employers, so the same title is not always the same company.
  const employer = pick(EMPLOYERS, index * 5 + Math.floor(index / JOBS.length))
  const workMode = employer.location === 'Remote' ? 'remote' : pick(WORK_MODES, index + Math.floor(index / 7))

  return {
    ...job,
    id: `l${index + 1}`,
    employerId: employer.id,
    location: workMode === 'remote' ? 'Remote' : employer.location,
    workMode,
    salary: vary(job.salary, index),
    postedAt: new Date(LISTINGS_AS_OF - (index * 3 + 1) * HOUR).toISOString(),
    applicantCount: job.applicantCount + ((index * 13) % 40),
  }
}

export const LISTINGS: Job[] = Array.from({ length: LISTING_COUNT }, (_, index) => buildListing(index))
