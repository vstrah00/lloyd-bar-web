// Shared by the Studio table and CSV import. No client or credentials here.
export type MenuDocument = {
  _id: string
  _type: 'category' | 'product'
  _rev: string
  name?: {en?: string; hr?: string}
  sortOrder?: number
  price?: number
  description?: {en?: string; hr?: string}
  category?: {_ref: string}
  slug?: {current?: string}
  [key: string]: unknown
}

export const columns = [
  'id', 'type', 'name_en', 'name_hr', 'sortOrder', 'price',
  'description_en', 'description_hr', 'categoryId', 'slug',
] as const

export type MenuRow = Record<(typeof columns)[number], string>
export type MenuChange = {
  id: string
  row: MenuRow
  source?: MenuDocument
  set: Record<string, unknown>
  unset: string[]
  fields: string[]
}

export function publishedId(id: string) {
  return id.replace(/^drafts\./, '')
}

export function effectiveDocuments(documents: MenuDocument[]) {
  const effective = new Map<string, MenuDocument>()
  for (const doc of documents) {
    const id = publishedId(doc._id)
    if (!effective.has(id) || doc._id.startsWith('drafts.')) effective.set(id, doc)
  }
  return effective
}

export function documentToRow(doc: MenuDocument): MenuRow {
  return {
    id: publishedId(doc._id), type: doc._type,
    name_en: doc.name?.en ?? '', name_hr: doc.name?.hr ?? '',
    sortOrder: doc.sortOrder == null ? '' : String(doc.sortOrder),
    price: doc._type === 'product' && doc.price != null ? String(doc.price) : '',
    description_en: doc.description?.en ?? '', description_hr: doc.description?.hr ?? '',
    categoryId: doc.category?._ref ?? '', slug: doc.slug?.current ?? '',
  }
}

export function menuRows(documents: MenuDocument[]): MenuRow[] {
  const rows = [...effectiveDocuments(documents).values()].map(documentToRow)
  const compareOrder = (a: MenuRow, b: MenuRow) =>
    (a.sortOrder === '' ? Infinity : Number(a.sortOrder)) - (b.sortOrder === '' ? Infinity : Number(b.sortOrder)) ||
    // Code-point ordering matches GROQ rather than the browser's language settings.
    (a.name_en < b.name_en ? -1 : a.name_en > b.name_en ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  const categoryRank = new Map(rows.filter((row) => row.type === 'category').sort(compareOrder).map((row, index) => [row.id, index]))
  return rows.sort((a, b) =>
    a.type.localeCompare(b.type) ||
    (a.type === 'product' ? (categoryRank.get(a.categoryId) ?? Infinity) - (categoryRank.get(b.categoryId) ?? Infinity) : 0) ||
    compareOrder(a, b),
  )
}

export function exportCsv(rows: MenuRow[]) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`
  return '\uFEFF' + [columns.join(','), ...rows.map((row) => columns.map((key) => escape(row[key])).join(','))].join('\r\n') + '\r\n'
}

// RFC 4180: quoted commas, quotes, and multiline descriptions are supported.
export function parseCsv(input: string): MenuRow[] {
  const text = input.replace(/^\uFEFF/, '')
  const records: string[][] = []
  let record: string[] = [], field = '', quoted = false, closed = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (char === '"') { quoted = false; closed = true }
      else field += char
    } else if (char === '"') {
      if (field || closed) throw new Error('Invalid quote in CSV. Export as comma-separated CSV with UTF-8 encoding.')
      quoted = true
    } else if (char === ',' || char === '\n' || char === '\r') {
      record.push(field); field = ''; closed = false
      if (char !== ',') {
        if (record.some((value) => value !== '')) records.push(record)
        record = []
        if (char === '\r' && text[i + 1] === '\n') i++
      }
    } else {
      if (closed) throw new Error('Unexpected text after a quoted CSV field.')
      field += char
    }
  }
  if (quoted) throw new Error('CSV has an unclosed quoted field.')
  record.push(field)
  if (record.some((value) => value !== '')) records.push(record)
  const header = records.shift()
  if (!header || header.length !== columns.length || new Set(header).size !== columns.length || columns.some((key) => !header.includes(key))) {
    throw new Error(`CSV must contain these headers exactly: ${columns.join(', ')}`)
  }
  if (records.length > 2000) throw new Error('Import at most 2,000 rows at a time.')
  return records.map((values, index) => {
    if (values.length !== header.length) throw new Error(`Row ${index + 2}: wrong number of columns.`)
    return Object.fromEntries(header.map((key, i) => [key, values[i]])) as MenuRow
  })
}

export function planChanges(rows: MenuRow[], documents: MenuDocument[]): MenuChange[] {
  const current = effectiveDocuments(documents)
  const categoryIds = new Set([...current].filter(([, doc]) => doc._type === 'category').map(([id]) => id))
  const ids = new Set<string>()
  const decimal = /^(?:0|[1-9]\d*)(?:\.\d+)?$/
  for (const row of rows) {
    if (!(current.has(row.id) ? /^[A-Za-z0-9_.-]{1,128}$/ : /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/).test(row.id)) throw new Error(`Invalid ID "${row.id}". Keep exported IDs; new IDs must start with a letter or number, followed by letters, numbers, hyphens or underscores.`)
    if (ids.has(row.id)) throw new Error(`Duplicate ID: ${row.id}`)
    ids.add(row.id)
    if (row.type !== 'category' && row.type !== 'product') throw new Error(`${row.id}: type must be category or product.`)
    const existing = current.get(row.id)
    if (existing && existing._type !== row.type) throw new Error(`${row.id}: document type cannot be changed.`)
    if (row.type === 'category') categoryIds.add(row.id)
  }
  const changes: MenuChange[] = []
  for (const row of rows) {
    const source = current.get(row.id)
    const previous = source ? documentToRow(source) : undefined
    const changed = columns.filter((key) => key !== 'id' && key !== 'type' && row[key] !== previous?.[key])
    if (source && changed.length === 0) continue
    // Validate changed rows only: incomplete, untouched legacy records don't block other edits.
    const fail = (message: string): never => { throw new Error(`${row.name_en || row.id}: ${message}`) }
    if (!row.name_en.trim() || !row.name_hr.trim()) fail('English and Croatian names are required.')
    if (row.sortOrder !== '' && (!/^\d+$/.test(row.sortOrder) || !Number.isSafeInteger(Number(row.sortOrder)))) fail('Menu order must be a non-negative whole number, or blank.')
    if (row.type === 'product') {
      if (!decimal.test(row.price) || !Number.isFinite(Number(row.price))) fail('Price must be a non-negative number using a decimal point (e.g. 3.50).')
      if (!categoryIds.has(row.categoryId)) fail('Choose an existing category or include a new category row in this import.')
      if (row.slug) fail('Products do not have a slug. Leave it blank.')
    } else {
      if (!row.slug.trim()) fail('Category slug is required.')
      if (row.price || row.categoryId || row.description_en || row.description_hr) fail('Price, categoryId and descriptions belong to product rows only.')
    }
    const set: Record<string, unknown> = {}
    const unset: string[] = []
    const assign = (key: keyof MenuRow, path: string, value: unknown, optional = false) => {
      if (source && row[key] === previous?.[key]) return
      if (optional && row[key] === '') unset.push(path)
      else set[path] = value
    }
    assign('name_en', 'name.en', row.name_en)
    assign('name_hr', 'name.hr', row.name_hr)
    assign('sortOrder', 'sortOrder', Number(row.sortOrder), true)
    if (row.type === 'category') assign('slug', 'slug', {_type: 'slug', current: row.slug})
    else {
      assign('price', 'price', Number(row.price))
      assign('description_en', 'description.en', row.description_en, true)
      assign('description_hr', 'description.hr', row.description_hr, true)
      assign('categoryId', 'category', {
        _type: 'reference', _ref: row.categoryId, _weak: true,
        _strengthenOnPublish: {type: 'category'},
      })
    }
    changes.push({id: row.id, row, source, set, unset, fields: changed})
  }
  // Publish a draft-only category with products that need it, without a separate step.
  for (const change of [...changes]) {
    if (change.row.type !== 'product') continue
    const id = change.row.categoryId
    if (documents.some((doc) => doc._id === id) || changes.some((item) => item.id === id)) continue
    const source = current.get(id)
    if (source) changes.push({id, row: documentToRow(source), source, set: {}, unset: [], fields: []})
  }
  if (changes.length > 500) throw new Error('Publish at most 500 changed documents at a time.')
  return changes
}

export function assertUnchanged(before: MenuDocument[], after: MenuDocument[], changes: MenuChange[]) {
  for (const change of changes) {
    for (const id of [change.id, `drafts.${change.id}`]) {
      if (before.find((doc) => doc._id === id)?._rev !== after.find((doc) => doc._id === id)?._rev) {
        throw new Error(`${change.row.name_en}: content changed in another session. Export your pending edits, reload, and import them again.`)
      }
    }
  }
}

export function publishedDocument(change: MenuChange) {
  // Preserve images, crop/hotspot, other locales and any fields outside the CSV.
  const seed: Record<string, unknown> = structuredClone(change.source ?? {})
  delete seed._rev
  delete seed._createdAt
  delete seed._updatedAt
  for (const [path, value] of Object.entries(change.set)) {
    const keys = path.split('.')
    let target = seed
    for (const key of keys.slice(0, -1)) {
      target[key] ??= {}
      target = target[key] as Record<string, unknown>
    }
    target[keys[keys.length - 1]] = structuredClone(value)
  }
  for (const path of change.unset) {
    const keys = path.split('.')
    let target: Record<string, unknown> | undefined = seed
    for (const key of keys.slice(0, -1)) target = target?.[key] as Record<string, unknown> | undefined
    if (target) delete target[keys[keys.length - 1]]
  }
  // Turn Studio's temporary draft references into published, strong references.
  const strengthen = (value: unknown) => {
    if (!value || typeof value !== 'object') return
    const object = value as Record<string, unknown>
    if (object._type === 'reference' && object._strengthenOnPublish) {
      delete object._weak
      delete object._strengthenOnPublish
    }
    for (const child of Object.values(object)) strengthen(child)
  }
  strengthen(seed)
  return {...seed, _id: change.id, _type: change.row.type}
}

type PublishedDocument = ReturnType<typeof publishedDocument>
type PublishMutation =
  | {patch: {id: string; ifRevisionID: string; set: {_type: string}}}
  | {create: PublishedDocument}
  | {createOrReplace: PublishedDocument}
  | {delete: {id: string}}

export function publishMutations(changes: MenuChange[], fresh: MenuDocument[]): PublishMutation[] {
  const mutations: PublishMutation[] = []
  // Guards run in the same atomic transaction as publication and draft cleanup.
  for (const change of changes) {
    for (const id of [change.id, `drafts.${change.id}`]) {
      const existing = fresh.find((doc) => doc._id === id)
      if (existing) mutations.push({patch: {id, ifRevisionID: existing._rev, set: {_type: existing._type}}})
    }
  }
  for (const change of changes) {
    const document = publishedDocument(change)
    // create() rejects a concurrent insert instead of replacing unseen content.
    mutations.push(fresh.some((doc) => doc._id === change.id) ? {createOrReplace: document} : {create: document})
    if (fresh.some((doc) => doc._id === `drafts.${change.id}`)) mutations.push({delete: {id: `drafts.${change.id}`}})
  }
  return mutations
}
