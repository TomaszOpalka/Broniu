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
            <path d={iconPaths[key]} fill="currentColor" />
          </svg>
        </a>
      ))}
    </nav>
  )
}
