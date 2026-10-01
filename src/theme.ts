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

  // chrome: jasny, ciemny, jasny odblask, ciemny, jasny (ikony i podpis)
  metal1: '#ffffff',
  metal2: '#b4c3c7',
  metal3: '#f4fbfc',
  metal4: '#7d8e93',
  metal5: '#d9e6e8',
  textGlow: 'rgba(34, 232, 218, 0.45)',

  light: '#ffffff',
} as const

export function applyThemeVars(root: HTMLElement = document.documentElement) {
  for (const [key, value] of Object.entries(theme)) {
    const name = '--' + key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
    root.style.setProperty(name, value)
  }
}
