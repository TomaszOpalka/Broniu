export const artist = 'Simon Broniu'

// Linki dodasz później: wystarczy podmienić '#'.
export const links = {
  instagram: '#',
  spotify: '#',
  youtube: '#',
  appleMusic: '#',
  tiktok: '#',
} as const

export const spin = {
  baseSpeed: 0.7, // rad/s, spokojny obrót w spoczynku
  friction: 1.8, // 1/s, im więcej tym szybciej wytraca (iOS ~ 2)
  dragSensitivity: 0.011, // rad na piksel przeciągnięcia
  wheelSensitivity: 0.012, // rad/s na jednostkę deltaY
  maxSpeed: 40, // rad/s
  velocityWindowMs: 90, // z jakiego okna liczymy prędkość puszczenia
} as const

export const bob = {
  amplitude: 0.13,
  speed: 2.1,
} as const
