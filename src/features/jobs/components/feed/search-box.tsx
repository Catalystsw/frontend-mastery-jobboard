import { useId } from 'react'

interface Props {
  onSearch: (query: string) => void
}

/** Reports every keystroke. No debounce: filtering 300 listings in memory is not the cost. */
export function SearchBox({ onSearch }: Props) {
  const id = useId()
  return (
    <div className="feed-search">
      <label htmlFor={id} className="sr-only">
        Search by title or company
      </label>
      <input
        id={id}
        type="search"
        placeholder="Search by title or company…"
        autoComplete="off"
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  )
}
