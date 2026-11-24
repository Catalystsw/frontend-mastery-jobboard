import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Job } from '@/domain'
import { LISTINGS as FEED_LISTINGS } from '@/data/fixtures/listings'
import { FeedPage } from './feed-page'
import type * as CompanySidebarModule from './company-sidebar'
import type * as FeedHeaderModule from './feed-header'
import type * as ListingResultsModule from './listing-results'

/**
 * What the React DevTools profiler counts, counted here: every render of the three components
 * the lesson watches. The wrappers call the real component, so the page behaves exactly the same.
 */
const { renders, counted } = vi.hoisted(() => {
  const renders = { FeedHeader: 0, CompanySidebar: 0, ListingResults: 0 }
  const counted =
    <P,>(name: keyof typeof renders, component: (props: P) => ReactNode) =>
    (props: P) => {
      renders[name]++
      return component(props)
    }
  return { renders, counted }
})

vi.mock('./feed-header', async (importOriginal) => {
  const actual = await importOriginal<typeof FeedHeaderModule>()
  return { ...actual, FeedHeader: counted('FeedHeader', actual.FeedHeader) }
})
vi.mock('./company-sidebar', async (importOriginal) => {
  const actual = await importOriginal<typeof CompanySidebarModule>()
  return { ...actual, CompanySidebar: counted('CompanySidebar', actual.CompanySidebar) }
})
vi.mock('./listing-results', async (importOriginal) => {
  const actual = await importOriginal<typeof ListingResultsModule>()
  return { ...actual, ListingResults: counted('ListingResults', actual.ListingResults) }
})

const listing = (id: string, title: string, employerId: string, overrides: Partial<Job> = {}): Job => ({
  id,
  title,
  employerId,
  location: 'Cairo, Egypt',
  workMode: 'hybrid',
  employmentType: 'full-time',
  seniority: 'mid',
  salary: null,
  skills: ['React', 'TypeScript'],
  postedAt: '2026-08-24T09:00:00.000Z',
  applicantCount: 12,
  ...overrides,
})

// e1 Catalyst · e2 Breadfast · e3 Instabug · e7 Vercel
const LISTINGS: Job[] = [
  listing('a', 'Senior Frontend Engineer', 'e1', { seniority: 'senior' }),
  listing('b', 'Frontend Engineer, Design Systems', 'e3'),
  listing('c', 'React Native Engineer', 'e2', { workMode: 'remote', location: 'Remote' }),
  listing('d', 'Junior Frontend Developer', 'e1', { seniority: 'junior' }),
  listing('e', 'Senior TypeScript Engineer', 'e7', {
    seniority: 'senior',
    workMode: 'remote',
    location: 'Remote',
  }),
]

function setup(listings: Job[] = LISTINGS) {
  const user = userEvent.setup()
  render(<FeedPage listings={listings} />)
  return { user, search: screen.getByRole('searchbox', { name: 'Search by title or company' }) }
}

const shownTitles = () =>
  screen.queryAllByRole('article').map((card) => within(card).getByRole('heading').textContent)

const savedCount = () => within(screen.getByRole('banner')).getByRole('status')

const saveButtonOf = (title: string) =>
  within(screen.getByRole('article', { name: title })).getByRole('button', { name: 'Save' })

beforeEach(() => {
  renders.FeedHeader = 0
  renders.CompanySidebar = 0
  renders.ListingResults = 0
})

describe("FeedPage — the feed's data", () => {
  // The profiler needs weight on the page. Checked on the fixture rather than by rendering 300
  // cards in jsdom, which would slow down every suite running beside this one.
  it('is 300 listings, each with its own id', () => {
    expect(FEED_LISTINGS).toHaveLength(300)
    expect(new Set(FEED_LISTINGS.map((item) => item.id)).size).toBe(300)
  })
})

describe('FeedPage — search', () => {
  it('narrows the list by title', async () => {
    const { user, search } = setup()
    await user.type(search, 'design')
    expect(shownTitles()).toEqual(['Frontend Engineer, Design Systems'])
  })

  it('matches the company name too, ignoring case', async () => {
    const { user, search } = setup()
    await user.type(search, 'CATALYST')
    expect(shownTitles()).toEqual(['Senior Frontend Engineer', 'Junior Frontend Developer'])
  })

  it('says so when nothing matches', async () => {
    const { user, search } = setup()
    await user.type(search, 'cobol')
    expect(shownTitles()).toEqual([])
    expect(screen.getByText('No roles match.')).toBeInTheDocument()
  })
})

describe('FeedPage — filters', () => {
  it('narrows the list to remote roles', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'Remote only' }))
    expect(shownTitles()).toEqual(['React Native Engineer', 'Senior TypeScript Engineer'])
  })

  it('narrows the list by seniority', async () => {
    const { user } = setup()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Seniority' }), 'Senior')
    expect(shownTitles()).toEqual(['Senior Frontend Engineer', 'Senior TypeScript Engineer'])
  })

  it('narrows the list by company', async () => {
    const { user } = setup()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Company' }), 'Catalyst')
    expect(shownTitles()).toEqual(['Senior Frontend Engineer', 'Junior Frontend Developer'])
  })

  it('combines with the search, and clearing the filters keeps the search', async () => {
    const { user, search } = setup()
    await user.click(screen.getByRole('checkbox', { name: 'Remote only' }))
    await user.type(search, 'senior')
    expect(shownTitles()).toEqual(['Senior TypeScript Engineer'])

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(shownTitles()).toEqual(['Senior Frontend Engineer', 'Senior TypeScript Engineer'])
  })
})

describe('FeedPage — saving', () => {
  it('updates the saved count in the header', async () => {
    const { user } = setup()
    expect(savedCount()).toHaveTextContent('0 saved')

    await user.click(saveButtonOf('Senior Frontend Engineer'))
    expect(savedCount()).toHaveTextContent('1 saved')
    expect(saveButtonOf('Senior Frontend Engineer')).toHaveAttribute('aria-pressed', 'true')

    await user.click(saveButtonOf('React Native Engineer'))
    expect(savedCount()).toHaveTextContent('2 saved')

    await user.click(saveButtonOf('Senior Frontend Engineer'))
    expect(savedCount()).toHaveTextContent('1 saved')
    expect(saveButtonOf('Senior Frontend Engineer')).toHaveAttribute('aria-pressed', 'false')
  })

  it('keeps a listing saved while a search hides it', async () => {
    const { user, search } = setup()
    await user.click(saveButtonOf('Senior Frontend Engineer'))

    await user.type(search, 'design')
    expect(shownTitles()).toEqual(['Frontend Engineer, Design Systems'])
    expect(savedCount()).toHaveTextContent('1 saved')

    await user.clear(search)
    expect(saveButtonOf('Senior Frontend Engineer')).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('FeedPage — what a keystroke renders', () => {
  // The profiler's finding, written down: with the query in FeedPage, every keystroke renders
  // FeedHeader and CompanySidebar again — "The parent component rendered" — though neither
  // shows anything that depends on the query.
  it('re-renders the results on each keystroke, and not the header or the sidebar', async () => {
    const { user, search } = setup()
    renders.FeedHeader = 0
    renders.CompanySidebar = 0
    renders.ListingResults = 0

    await user.type(search, 'react')

    expect(renders.ListingResults, 'the results follow the query').toBeGreaterThanOrEqual(5)
    expect(renders.FeedHeader, 'FeedHeader rendered on a keystroke').toBe(0)
    expect(renders.CompanySidebar, 'CompanySidebar rendered on a keystroke').toBe(0)
  })

  it('still re-renders the header when a listing is saved', async () => {
    const { user } = setup()
    renders.FeedHeader = 0

    await user.click(saveButtonOf('React Native Engineer'))

    expect(renders.FeedHeader).toBe(1)
    expect(savedCount()).toHaveTextContent('1 saved')
  })
})
