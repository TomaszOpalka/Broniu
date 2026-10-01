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

// Glif jako maska: wypełnia go ten sam chromowy gradient co podpis,
// więc połysk przy obrocie płyty przesuwa się po wszystkim naraz.
const glyphUrl = (d: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${d}'/></svg>`,
  )}")`

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
          <span className="social__glyph" style={{ ['--glyph' as string]: glyphUrl(iconPaths[key]) }} />
        </a>
      ))}
    </nav>
  )
}
