import {cache} from 'react'
import type {MenuCategory} from '@/lib/menu'
import {client} from './client'
import {CATEGORY_QUERY} from './queries'

// Both /menu and /qr share this published snapshot and its 20-second data cache.
// Bypass Sanity's CDN so its cache cannot prolong stale prices or ordering.
const menuClient = client.withConfig({useCdn: false, perspective: 'published'})

export const getMenu = cache(() => menuClient.fetch<MenuCategory[]>(CATEGORY_QUERY, {}, {
  next: {revalidate: 20, tags: ['menu']},
}))
