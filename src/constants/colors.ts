import { ValueOf } from '~/@types'

export const COLORS = {
  white: '#f5f5f5',
  silver: '#b4b4b4',
  grey: '#3e3e3e',
  charcoal: '#1f1f1f',
  black: '#0d0d0d',
  red: '#ff2e1f',
  orange: '#ff9338',
  yellow: '#f8c630',
  green: '#00cc69',
  blue: '#00a3d1',
  purple: '#703faf',
  transparent: 'transparent',
} as const

export type Color = ValueOf<typeof COLORS>
export type ColorObj = { name: string; value: Color }

export const colors = Object.entries(COLORS).map(([key, value]) => ({
  name: key,
  value,
}))
