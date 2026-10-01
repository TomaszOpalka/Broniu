// Jedno źródło kolorystyki: CSS czyta zmienne z :root, scena 3D czyta te same wartości.
// Zmieniasz kolor tutaj i zmienia się cała strona.
export const theme = {
  bgTop: '#021013',
  bgMid: '#03383c',
  bgBottom: '#046a6c',

  grid: '#22e8da',
  gridGlow: '#1ab8ff',

  discTint: '#c9d3d6',
  discHub: '#0c1a1d',
  rim: '#3df5e6',

  iconBg: 'rgba(8, 40, 42, 0.62)',
  iconBorder: 'rgba(255, 255, 255, 0.14)',
  iconFg: '#ffffff',

  text: '#ffffff',
  textGlowA: '#ff2d95',
  textGlowB: '#22e8da',

  light: '#ffffff',
} as const

export function applyThemeVars(root: HTMLElement = document.documentElement) {
  for (const [key, value] of Object.entries(theme)) {
    const name = '--' + key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
    root.style.setProperty(name, value)
  }
}
