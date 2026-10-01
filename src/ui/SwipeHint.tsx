import { useEffect, useState } from 'react'
import { hintDelayMs } from '../config'

// Klasyczna ikonka "przeciągnij": pojawia się raz po kilku sekundach
// i znika przy pierwszym dotknięciu/scrollu.
export function SwipeHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let shown = false
    const hide = () => {
      clearTimeout(show)
      clearTimeout(auto)
      setVisible(false)
      window.removeEventListener('pointerdown', hide)
      window.removeEventListener('wheel', hide)
    }
    const show = setTimeout(() => {
      shown = true
      setVisible(true)
    }, hintDelayMs)
    const auto = setTimeout(() => shown && hide(), hintDelayMs + 5200)
    window.addEventListener('pointerdown', hide)
    window.addEventListener('wheel', hide, { passive: true })
    return hide
  }, [])

  if (!visible) return null

  return (
    <div className="hint" aria-hidden="true">
      <svg viewBox="0 0 120 80" className="hint__svg">
        <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 40h18M12 33l-7 7 7 7" />
          <path d="M114 40H96M108 33l7 7-7 7" />
        </g>
        <g className="hint__hand">
          <path
            d="M56 14a5 5 0 0 1 10 0v26l3-1a5 5 0 0 1 7 2l1 .5a5 5 0 0 1 6 3l.5 1a5 5 0 0 1 5 6v10c0 8-6 14-14 14H62c-5 0-9-3-12-7l-9-13a4.5 4.5 0 0 1 7-5l5 5z"
            fill="#fff"
            stroke="#0a2e31"
            strokeWidth="2.5"
            strokeLinejoin="round"
            transform="translate(2 0)"
          />
        </g>
      </svg>
    </div>
  )
}
