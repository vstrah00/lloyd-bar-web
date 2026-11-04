import QrMenuClient from '@/components/QrMenuClient'
import {getMenu} from '@/sanity/lib/menu'

export const revalidate = 20

export default async function QrMenuPage({params}: {
  params: Promise<{locale: string}>
}) {
  const {locale: routeLocale} = await params
  const locale = routeLocale === 'hr' ? 'hr' : 'en'
  const categories = await getMenu()
  return <QrMenuClient products={categories} locale={locale} />
}
