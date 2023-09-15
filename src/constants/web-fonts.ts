import { ValueOf } from '~/@types'

export const FONT_FAMILIES = {
  Default: 'Montserrat, sans-serif',
  ['Times New Roman']: '"Times New Roman", "Times", serif',
  Georgia: '"Georgia", serif',
  Palatino: '"Palatino", serif',
  Baskerville: '"Baskerville", serif',
  Helvetica: '"Helvetica", sans-serif',
  Arial: '"Arial", sans-serif',
  'Arial Black': '"Arial Black", sans-serif',
  Verdana: '"Verdana", sans-serif',
  Tahoma: '"Tahoma", sans-serif',
  'Trebuchet MS': '"Trebuchet MS", sans-serif',
  Impact: '"Impact", sans-serif',
  ['Andalé Mono']: '"Andalé Mono", monospace',
  Courier: '"Courier", monospace',
  Lucida: '"Lucida", monospace',
  Monaco: '"Monaco", monospace',
  'Bradley Hand': '"Bradley Hand", cursive',
  ['Brush Script MT']: '"Brush Script MT", cursive',
  Luminari: '"Luminari", fantasy',
  ['Comic Sans']: '"Comic Sans MS", "Comic Sans", cursive',
} as const

export type FontFamily = ValueOf<typeof FONT_FAMILIES>
export type FontFamilyObj = { name: string; value: FontFamily }

export const fontFamilies = Object.entries(FONT_FAMILIES).map(
  ([key, value]) => ({
    name: key,
    value,
  })
)
