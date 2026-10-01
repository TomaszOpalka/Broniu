import { links } from '../config'
import { iconPaths } from './iconPaths'

type Item = { key: keyof typeof links; label: string; big?: boolean }

const items: Item[] = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'spotify', label: 'Spotify' },
  { key: 'youtube', label: 'YouTube', big: true },
  { key: 'appleMusic', label: 'Apple Music' },
  { key: 'tiktok', label: 'TikTok' },
]

export function SocialBar() {
  return (
    <nav className="social" aria-label="Social media">
      {/* wspólny gradient chrome dla wszystkich glifów (kolory z theme.ts) */}
      <svg width="0" height="0" className="social__defs" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--metal1)' }} />
            <stop offset="0.3" style={{ stopColor: 'var(--metal2)' }} />
            <stop offset="0.5" style={{ stopColor: 'var(--metal3)' }} />
            <stop offset="0.72" style={{ stopColor: 'var(--metal4)' }} />
            <stop offset="1" style={{ stopColor: 'var(--metal5)' }} />
          </linearGradient>
        </defs>
      </svg>
      {items.map(({ key, label, big }) => (
        <a
          key={key}
          className={big ? 'social__btn social__btn--big' : 'social__btn'}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={iconPaths[key]} fill="url(#chrome)" />
          </svg>
        </a>
      ))}
    </nav>
  )
}
