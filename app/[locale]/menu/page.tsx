import MenuClient from '@/components/MenuClient'
import {getMenu} from '@/sanity/lib/menu'

export const revalidate = 20

export default async function MenuPage({params}: {
  params: Promise<{locale: string}>
}) {
  const {locale: routeLocale} = await params
  const locale = routeLocale === 'hr' ? 'hr' : 'en'
  const categories = await getMenu()
  return <MenuClient products={categories} locale={locale} />
}
