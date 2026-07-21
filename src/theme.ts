/**
 * Rally's look, in ONE place — a Partiful-style celebratory palette built on a
 * single striking accent (electric rose) over near-black ink, with a warm cream
 * ticket stub. Raw hex is used deliberately: @hanzo/gui color props accept it,
 * so the brand reads the same on every surface without touching the gui config.
 */
export const rally = {
  ink: '#0E0714',
  inkSoft: '#1B1022',
  accent: '#FF2E7E',
  accentDeep: '#C60E5E',
  accentSoft: '#FF8FBF',
  glow: '#7A1E8C',
  ember: '#FF5E5B',
  cream: '#FFF5EC',
  creamEdge: '#F3DFD0',
  onAccent: '#FFFFFF',
  onAccentDim: 'rgba(255,255,255,0.72)',
  onInkDim: 'rgba(255,255,255,0.62)',
  onCream: '#2A1420',
  onCreamDim: 'rgba(42,20,32,0.60)',
  gold: '#FFCE4A',
  good: '#1DB954',
  goodInk: '#0B2E1A',
} as const

/** The full-bleed hero flood — a lush celebratory sweep of the accent. */
export const heroGradient = [rally.glow, rally.accentDeep, rally.accent, rally.ember]
