export const artist = "Simon Broniu";

export const links = {
  instagram: "https://www.instagram.com/simon_broniu",
  spotify: "https://open.spotify.com/artist/3507DvbzwripyhdeYylzAD",
  youtube: "https://youtube.com/@simonbroniu",
  appleMusic: "https://music.apple.com/pl/artist/simon-broniu/6811883446?l=pl",
  tiktok: "https://www.tiktok.com/@simon.broniu",
} as const;

export const spin = {
  baseSpeed: 0.7, // rad/s, spokojny obrót w spoczynku
  friction: 1.8, // 1/s, im więcej tym szybciej wytraca (iOS ~ 2)
  dragSensitivity: 0.011, // rad na piksel przeciągnięcia
  wheelSensitivity: 0.012, // rad/s na jednostkę deltaY
  maxSpeed: 40, // rad/s
  velocityWindowMs: 90, // z jakiego okna liczymy prędkość puszczenia
} as const;

export const bob = {
  amplitude: 0.13,
  speed: 2.1,
} as const;

// Podpowiedź "zakręć płytą": pojawia się raz, po tylu ms od wejścia.
export const hintDelayMs = 8000;
