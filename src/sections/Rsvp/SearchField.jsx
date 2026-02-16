import { useState, useRef, useEffect } from 'react'
import './SearchField.scss'

export default function SearchField({ guests, onSelect, placeholder = 'Search your name...' }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const lower = query.toLowerCase()
    const filtered = guests.filter((g) => g.name.toLowerCase().includes(lower))
    setResults(filtered)
    setSelectedIndex(-1)
    setIsOpen(true)
  }, [query, guests])

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[selectedIndex]
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  const handleSelect = (guest) => {
    setQuery('')
    setIsOpen(false)
    onSelect(guest)
  }

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleBlur = (e) => {
    if (e.relatedTarget?.closest('.search-field__dropdown')) return
    setTimeout(() => setIsOpen(false), 150)
  }

  return (
    <div className="search-field">
      <input
        ref={inputRef}
        type="text"
        className="search-field__input font-text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoComplete="off"
      />
      {isOpen && (
        <ul className="search-field__dropdown" ref={listRef}>
          {results.length > 0 ? (
            results.map((guest, i) => (
              <li
                key={guest.rowNumber}
                className={`search-field__item font-text ${i === selectedIndex ? 'search-field__item--selected' : ''}`}
                onMouseDown={() => handleSelect(guest)}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {guest.name}
              </li>
            ))
          ) : (
            <li className="search-field__item search-field__item--empty font-text">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
