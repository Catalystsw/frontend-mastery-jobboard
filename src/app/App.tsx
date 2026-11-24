import { FeedPage } from '@/features/jobs'
import { JobBoard } from './job-board'

/**
 * The composition root. It owns no business logic — it picks the page and wires the features
 * together.
 *
 * There is no router until module 6 brings `app/routes.tsx`, so until then the path picks the
 * page: `/` is the listings feed from `module-5/feed-ui`, `/board` the search-and-detail board.
 */
export function App() {
  return window.location.pathname.startsWith('/board') ? <JobBoard /> : <FeedPage />
}
