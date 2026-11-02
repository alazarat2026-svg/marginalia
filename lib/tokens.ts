export const colors = {
  canvas: '#F3F1EC',
  readingSurface: '#FAF8F4',
  surfaceRaised: '#FFFFFF',
  inkStrong: '#1C1B19',
  inkBody: '#2E2C29',
  inkMuted: '#6B6862',
  inkFaint: '#9C988F',
  line: '#E4E0D8',
  accent: '#2F6B4F',
  accentHover: '#25553E',
  accentSoft: '#E7F0EA',
  statusProcessing: '#B5761E',
  statusProcessingBg: '#FBF3E4',
  statusReady: '#2F6B4F',
  statusReadyBg: '#E7F0EA',
  statusFailed: '#A8503C',
  statusFailedBg: '#F7E9E4',
} as const;

export const fonts = {
  serif: '"Source Serif 4", Georgia, serif',
  sans: 'Inter, system-ui, sans-serif',
} as const;

export const radii = {
  sm: '6px',
  btn: '8px',
  md: '10px',
  lg: '14px',
} as const;

export const shadows = {
  elevation1: '0 1px 2px rgba(28,27,25,0.05)',
} as const;

export const focusRing = 'rgba(47,107,79,0.4)' as const;
