interface Props {
  savedCount: number
}

/** The page's top bar. The only thing in it that changes is the saved count. */
export function FeedHeader({ savedCount }: Props) {
  return (
    <header className="topbar feed-topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-name">Rasmi</span>
        <span className="brand-tag">frontend jobs</span>
      </div>

      <nav className="topbar-actions" aria-label="Your listings">
        <SavedCount count={savedCount} />
      </nav>
    </header>
  )
}

function SavedCount({ count }: { count: number }) {
  return (
    <span className="saved-count" role="status">
      <strong>{count}</strong> saved
    </span>
  )
}
