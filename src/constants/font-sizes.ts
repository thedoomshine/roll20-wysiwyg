import { ValueOf } from '~/@types'

export const FONT_SIZES = {
  'Normal text': 0,
  Title: 1,
  Subtitle: 2,
  'Heading 1': 3,
  'Heading 2': 4,
  'Heading 3': 5,
} as const

export type FontSize = ValueOf<typeof FONT_SIZES>
export type FontSizeObj = { name: string; value: FontSize }

export const fontSizes = Object.entries(FONT_SIZES).map(([key, value]) => ({
  name: key,
  value,
}))
