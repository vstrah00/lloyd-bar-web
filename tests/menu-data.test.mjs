import {test} from 'node:test'
import assert from 'node:assert/strict'
import {
  assertUnchanged, documentToRow, draftSeed, effectiveDocuments,
  exportCsv, menuRows, parseCsv, planChanges,
} from '../sanity/tools/menuData.ts'

const category = {_id: 'coffee', _type: 'category', _rev: 'cat1', name: {en: 'Coffee', hr: 'Kava'}, slug: {_type: 'slug', current: 'coffee'}, sortOrder: 10}
const product = {
  _id: 'espresso', _type: 'product', _rev: 'p1', _createdAt: '2026-01-01', _updatedAt: '2026-01-01',
  name: {en: 'Espresso', hr: 'Espresso', de: 'Espresso'}, price: 2.5,
  description: {en: 'Strong, "small" coffee\nSecond line', hr: 'Kava s mlijekom: čćžšđ'},
  category: {_type: 'reference', _ref: 'coffee'},
  image: {_type: 'image', asset: {_type: 'reference', _ref: 'image-abc-10x10-jpg'}, hotspot: {x: 0.3, y: 0.5}},
  custom: {keep: true},
}
const documents = [category, product]
const priceEdit = (value = '3.50') => ({...documentToRow(product), price: value})

test('CSV round-trips Croatian Unicode, multiline descriptions, quotes, commas, blank and zero fields', () => {
  const rows = menuRows([...documents, {...product, _id: 'free', price: 0, sortOrder: 0}])
  assert.deepEqual(parseCsv(exportCsv(rows)), rows)
  assert.equal(planChanges(parseCsv(exportCsv(rows)), [...documents, {...product, _id: 'free', price: 0, sortOrder: 0}]).length, 0)
})

test('CSV supports LF, reordered headers and final records without newline', () => {
  const csv = exportCsv([documentToRow(category)]).replace(/^\uFEFF/, '').trimEnd().replace(/\r\n/g, '\n')
  const lines = csv.split('\n').map((line) => line.split(',').reverse().join(','))
  assert.deepEqual(parseCsv(lines.join('\n')), [documentToRow(category)])
})

test('CSV rejects unclosed quotes, duplicate/missing headers, and malformed rows', () => {
  const csv = exportCsv([documentToRow(category)])
  assert.throws(() => parseCsv(csv + '"unclosed'), /unclosed/)
  assert.throws(() => parseCsv(csv.replace('name_hr', 'name_en')), /headers/)
  assert.throws(() => parseCsv(csv + 'a,b\n'), /columns/)
  assert.throws(() => parseCsv(csv + '"abc"junk\n'), /Unexpected/)
  assert.throws(() => parseCsv('id;type;name_en'), /headers/)
})

test('draft takes precedence regardless of fetch order; unchanged export is a no-op', () => {
  const draft = {...product, _id: 'drafts.espresso', _rev: 'd1', price: 4}
  for (const docs of [[product, draft, category], [draft, product, category]]) {
    assert.equal(effectiveDocuments(docs).get('espresso').price, 4)
    assert.equal(menuRows(docs).length, 2)
    assert.deepEqual(planChanges(menuRows(docs), docs), [])
  }
})

test('price-only edit patches only price and draft seeding preserves all other content', () => {
  const [change] = planChanges([priceEdit()], documents)
  assert.deepEqual(change.set, {price: 3.5})
  assert.deepEqual(change.unset, [])
  const seed = draftSeed(change)
  assert.equal(seed._id, 'drafts.espresso')
  assert.equal(seed._rev, undefined)
  assert.equal(seed._createdAt, undefined)
  assert.equal(seed._updatedAt, undefined)
  assert.deepEqual(seed.image, product.image)
  assert.deepEqual(seed.custom, product.custom)
  assert.equal(seed.name.de, 'Espresso')
  assert.equal(seed.category._ref, 'coffee')
})

test('missing rows do not generate deletes; blank optional fields explicitly clear values', () => {
  const row = {...documentToRow(product), description_hr: '', sortOrder: ''}
  const [change] = planChanges([row], documents)
  assert.deepEqual(change.unset, ['description.hr'])
  assert.deepEqual(change.set, {})
  assert.equal(planChanges([row], documents).length, 1)
})

test('zero price/order are retained and invalid prices/orders are rejected', () => {
  const [change] = planChanges([{...priceEdit('0'), sortOrder: '0'}], documents)
  assert.equal(change.set.price, 0)
  assert.equal(change.set.sortOrder, 0)
  for (const price of ['-1', 'NaN', 'Infinity', '2,50', '0x10', '1e3', '']) {
    assert.throws(() => planChanges([priceEdit(price)], documents), /Price/)
  }
  for (const sortOrder of ['-1', '1.5', 'NaN', '9007199254740992']) {
    assert.throws(() => planChanges([{...priceEdit(), sortOrder}], documents), /Menu order/)
  }
})

test('duplicate IDs, changing type, missing translations and unknown category are rejected', () => {
  assert.throws(() => planChanges([priceEdit(), priceEdit()], documents), /Duplicate/)
  assert.throws(() => planChanges([{...priceEdit(), type: 'category'}], documents), /type cannot/)
  assert.throws(() => planChanges([{...priceEdit(), name_hr: ' '}], documents), /names are required/)
  assert.throws(() => planChanges([{...priceEdit(), categoryId: 'missing'}], documents), /category/)
  assert.throws(() => planChanges([{...priceEdit(), id: 'drafts.espresso'}], documents), /Invalid ID/)
})

test('new category and products can be imported together in either row order', () => {
  const cat = {...documentToRow(category), id: 'tea', name_en: 'Tea', name_hr: 'Čaj', slug: 'tea'}
  const drink = {...priceEdit(), id: 'black-tea', categoryId: 'tea'}
  for (const rows of [[cat, drink], [drink, cat]]) {
    const changes = planChanges(rows, documents)
    assert.equal(changes.length, 2)
    const change = changes.find((item) => item.id === 'black-tea')
    assert.equal(change.set.category._ref, 'tea')
    assert.equal(change.set.category._weak, true)
    assert.deepEqual(change.set.category._strengthenOnPublish, {type: 'category'})
  }
})

test('existing dotted IDs survive round-trip; other source fields remain outside patches', () => {
  const doc = {...product, _id: 'legacy.espresso'}
  const row = {...documentToRow(doc), name_en: 'New name'}
  assert.deepEqual(planChanges([row], [category, doc])[0].set, {'name.en': 'New name'})
})

test('concurrent published/draft edits, creation, deletion and ID collisions block save', () => {
  const changes = planChanges([priceEdit()], documents)
  assert.doesNotThrow(() => assertUnchanged(documents, documents, changes))
  for (const latest of [
    [category, {...product, _rev: 'p2'}],
    [...documents, {...product, _id: 'drafts.espresso', _rev: 'd1'}],
    [category],
  ]) assert.throws(() => assertUnchanged(documents, latest, changes), /another session/)
  const newChanges = planChanges([{...priceEdit(), id: 'new-drink'}], documents)
  assert.throws(() => assertUnchanged(documents, [{_id: 'new-drink', _type: 'author', _rev: 'collision'}], newChanges), /another session/)
})

test('numbered items precede unnumbered items, with stable name/ID tie-breakers independent of update times', () => {
  const docs = [
    {...product, _id: 'b', name: {en: 'B'}, sortOrder: 20},
    {...product, _id: 'z', name: {en: 'Z'}, sortOrder: 10},
    {...product, _id: 'a', name: {en: 'A'}, sortOrder: 20},
    {...product, _id: 'unranked', name: {en: 'A'}},
  ]
  assert.deepEqual(menuRows(docs).map((row) => row.id), ['z', 'a', 'b', 'unranked'])
})

test('the table groups products in category menu order rather than category ID order', () => {
  const other = {...category, _id: 'aaa', sortOrder: 20}
  const drink = {...product, _id: 'other', category: {_ref: 'aaa'}, sortOrder: 0}
  const rows = menuRows([other, drink, product, category])
  assert.deepEqual(rows.map((row) => row.id), ['coffee', 'aaa', 'espresso', 'other'])
})
