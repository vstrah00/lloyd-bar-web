export type MenuLocale = 'en' | 'hr'
export type LocalizedMenuText = {en?: string; hr?: string} | null | undefined

export type MenuProduct = {
  _id: string
  name?: LocalizedMenuText
  price: number
  description?: LocalizedMenuText
  image?: {asset?: {_ref: string} | null} | null
}

export type MenuCategory = {
  _id: string
  name?: LocalizedMenuText
  products: MenuProduct[]
}

export function menuText(value: LocalizedMenuText, locale: MenuLocale, fallback = '') {
  return value?.[locale]?.trim() || value?.[locale === 'hr' ? 'en' : 'hr']?.trim() || fallback
}
