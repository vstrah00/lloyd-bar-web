'use client'

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useClient} from 'sanity'
import {IntentLink} from 'sanity/router'
import {ArrowDownUp} from 'lucide-react'
import {
  assertUnchanged, columns, effectiveDocuments, exportCsv, publishMutations,
  menuRows, parseCsv, planChanges,
  type MenuChange, type MenuDocument, type MenuRow,
} from './menuData'
import styles from './MenuManager.module.css'

const query = '*[_type in ["category", "product"] && !(_id in path("versions.**"))]'

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], {type}))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
}

export function MenuManager() {
  const studioClient = useClient({apiVersion: '2024-12-25'})
  const client = useMemo(() => studioClient.withConfig({useCdn: false, perspective: 'raw'}), [studioClient])
  const [documents, setDocuments] = useState<MenuDocument[]>([])
  const [rows, setRows] = useState<MenuRow[]>([])
  const [section, setSection] = useState<'category' | 'product'>('category')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [review, setReview] = useState<MenuChange[] | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const initialRows = useMemo(() => menuRows(documents), [documents])
  const dirty = JSON.stringify(initialRows) !== JSON.stringify(rows)
  const categories = rows.filter((row) => row.type === 'category')
  const effective = useMemo(() => effectiveDocuments(documents), [documents])

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const docs = await client.fetch<MenuDocument[]>(query)
      setDocuments(docs)
      setRows(menuRows(docs))
      setLoaded(true)
      setReview(null)
    } catch (cause) { setError(errorMessage(cause)) }
    finally { setBusy(false) }
  }, [client])

  useEffect(() => { void load() }, [load])
  useEffect(() => {
    const preventLoss = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = '' }
    if (dirty) window.addEventListener('beforeunload', preventLoss)
    return () => window.removeEventListener('beforeunload', preventLoss)
  }, [dirty])

  const edit = (id: string, key: keyof MenuRow, value: string) => {
    setRows((current) => current.map((row) => row.id === id ? {...row, [key]: value} : row))
    setReview(null)
    setNotice('')
  }

  const reviewChanges = () => {
    setError('')
    try {
      const changes = planChanges(rows, documents)
      setReview(changes)
      if (!changes.length) setNotice('No changes to publish.')
    } catch (cause) { setError(errorMessage(cause)); setReview(null) }
  }

  const importFile = async (file: File) => {
    setBusy(true)
    setError('')
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('CSV must be smaller than 2 MB.')
      const imported = parseCsv(await file.text())
      // Omitted rows are retained. Import never deletes a document.
      const merged = new Map(rows.map((row) => [row.id, row]))
      for (const row of imported) merged.set(row.id, row)
      // Validate the actual file first so duplicate IDs cannot disappear in the merge.
      planChanges(imported, documents)
      const nextRows = [...merged.values()]
      const changes = planChanges(nextRows, documents)
      setRows(nextRows)
      setReview(changes)
      setNotice(`Read ${imported.length} CSV rows. Review ${changes.length} changed documents below before publishing.`)
    } catch (cause) { setError(errorMessage(cause)) }
    finally { setBusy(false) }
  }

  const publishChanges = async () => {
    if (!review?.length) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const ids = review.flatMap((change) => [change.id, `drafts.${change.id}`])
      const batches = Array.from({length: Math.ceil(ids.length / 50)}, (_, index) => ids.slice(index * 50, (index + 1) * 50))
      const fresh = (await Promise.all(batches.map((batch) => client.getDocuments<MenuDocument>(batch))))
        .flat().filter((doc) => doc !== null)
      assertUnchanged(documents, fresh, review)
      await client.mutate(publishMutations(review, fresh), {visibility: 'sync'})
      setNotice(`Published ${review.length} ${review.length === 1 ? 'document' : 'documents'}. Your menu will update within about 20 seconds.`)
      // Don't repeat publication if the reload fails after a successful transaction.
      setReview(null)
      await load()
    } catch (cause) {
      setError(`Could not confirm publication: ${errorMessage(cause)} Export pending edits before discarding them and reloading to check Sanity.`)
      setReview(null)
    } finally { setBusy(false) }
  }

  const visible = rows.filter((row) => row.type === section &&
    (!category || section === 'category' || row.categoryId === category) &&
    `${row.name_en} ${row.name_hr} ${row.id}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Menu manager</h1>
        <p>Edit categories and products together. Lower menu order numbers appear first; products are ordered within their category. Editing a price will no longer change its position.</p>
        <p>Edit, review, then publish the whole batch with one click. Your website updates within about 20 seconds.</p>
      </div>

      <div className={styles.toolbar}>
        <button disabled={busy || !loaded} onClick={() => download(exportCsv(rows), 'lloyd-menu.csv', 'text/csv;charset=utf-8')}>Export menu CSV</button>
        <button disabled={busy || !loaded} onClick={() => fileInput.current?.click()}>Import menu CSV</button>
        <input ref={fileInput} type="file" accept=".csv,text/csv" hidden onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) void importFile(file)
        }} />
        <button disabled={busy || !dirty} onClick={reviewChanges}>Review changes</button>
        <button disabled={busy || !dirty} onClick={() => {setRows(initialRows); setReview(null); setError(''); setNotice('Pending edits discarded.')}}>Discard pending edits</button>
        <button disabled={busy || dirty} onClick={() => {setNotice(''); void load()}}>Reload from Sanity</button>
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {busy && <p role="status">Working…</p>}

      {review && review.length > 0 && (
        <section className={styles.review} aria-label="Review changes">
          <h2>Review {review.length} {review.length === 1 ? 'document' : 'documents'}</h2>
          <p>Publishing applies this whole batch immediately, including existing drafts for these documents. Images and fields outside the CSV are kept; missing CSV rows are kept.</p>
          <ul>{review.map((change) => <li key={change.id}>
            <strong>{change.row.name_en}</strong> ({change.row.type}{!change.source ? ', new' : ''})
            {change.fields.length === 0 && <p>Publish the category draft with its products.</p>}
            <dl>{change.fields.map((key) => <div key={key}>
              <dt>{key}</dt>
              <dd><del>{change.source ? menuRows([change.source])[0][key as keyof MenuRow] || '(blank)' : '(new)'}</del> → <ins>{change.row[key as keyof MenuRow] || '(blank)'}</ins></dd>
            </div>)}</dl>
          </li>)}</ul>
          <button disabled={busy} onClick={() => void publishChanges()}>Publish {review.length} {review.length === 1 ? 'document' : 'documents'}</button>
          <button disabled={busy} onClick={() => setReview(null)}>Back to editing</button>
        </section>
      )}

      <fieldset disabled={busy || !loaded} className={styles.editor}>
        <legend>Menu data</legend>
        <div className={styles.toolbar}>
          <label>Show<select value={section} onChange={(event) => setSection(event.target.value as 'category' | 'product')}>
            <option value="category">Categories ({categories.length})</option>
            <option value="product">Products ({rows.filter((row) => row.type === 'product').length})</option>
          </select></label>
          {section === 'product' && <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((row) => <option key={row.id} value={row.id}>{row.name_en}</option>)}
          </select></label>}
          <label>Search<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or ID" /></label>
        </div>
        <div className={styles.tableWrap}>
          <table>
            <caption>Keep IDs unchanged when editing exported CSV. Add new rows with unique IDs to create products or categories. Blank optional cells clear those fields. Use a decimal point for prices.</caption>
            <thead><tr><th scope="col">Document</th><th scope="col">Menu order</th><th scope="col">English name</th><th scope="col">Croatian name</th>
              {section === 'product' ? <><th scope="col">Price (€)</th><th scope="col">Category</th><th scope="col">English description</th><th scope="col">Croatian description</th></> : <th scope="col">Slug</th>}
            </tr></thead>
            <tbody>{visible.map((row) => <tr key={row.id}>
              <td><IntentLink intent="edit" params={{id: row.id, type: row.type}}>{row.id}</IntentLink><small>{effective.get(row.id)?._id.startsWith('drafts.') ? 'Draft' : effective.has(row.id) ? 'Published' : 'New'}</small></td>
              {(['sortOrder', 'name_en', 'name_hr'] as const).map((key) => <td key={key}><input
                aria-label={`${row.name_en} ${key}`} type={key === 'sortOrder' ? 'number' : 'text'}
                min={key === 'sortOrder' ? 0 : undefined} step={key === 'sortOrder' ? 1 : undefined}
                value={row[key]} onChange={(event) => edit(row.id, key, event.target.value)} /></td>)}
              {section === 'product' ? <>
                <td><input aria-label={`${row.name_en} price`} type="number" min="0" step="0.01" value={row.price} onChange={(event) => edit(row.id, 'price', event.target.value)} /></td>
                <td><select aria-label={`${row.name_en} category`} value={row.categoryId} onChange={(event) => edit(row.id, 'categoryId', event.target.value)}>
                  <option value="">Choose category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name_en}</option>)}
                </select></td>
                {(['description_en', 'description_hr'] as const).map((key) => <td key={key}><textarea aria-label={`${row.name_en} ${key}`} value={row[key]} onChange={(event) => edit(row.id, key, event.target.value)} /></td>)}
              </> : <td><input aria-label={`${row.name_en} slug`} value={row.slug} onChange={(event) => edit(row.id, 'slug', event.target.value)} /></td>}
            </tr>)}</tbody>
          </table>
          {!visible.length && loaded && <p>No matching documents. Create them in Structure, or add rows to an exported CSV.</p>}
        </div>
      </fieldset>

      <details className={styles.help}>
        <summary>CSV help and full database backups</summary>
        <p>Export contains current categories and products, including drafts. Keep all {columns.length} headers. Import matches by ID, updates only the supported fields, and never deletes missing rows. Existing photos stay attached; upload new photos in the document editor. To add a category, include its unique ID, both names, type “category”, and slug; use that ID in new product rows.</p>
        <p>Menu CSV is for bulk menu editing. For a full backup of all content, drafts, and image/file binaries, use the project’s <code>npm run sanity:export -- &lt;dataset&gt; &lt;backup.tar.gz&gt;</code> command. Restore into a test dataset first with <code>npm run sanity:import -- &lt;backup.tar.gz&gt; &lt;test-dataset&gt;</code>. See <code>docs/sanity-content.md</code> in the repository for instructions.</p>
      </details>
    </div>
  )
}

export const menuManagerTool = {
  name: 'menu-manager',
  title: 'Menu manager',
  icon: ArrowDownUp,
  component: MenuManager,
}
