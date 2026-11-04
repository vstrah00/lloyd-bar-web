import {test} from 'node:test'
import assert from 'node:assert/strict'
import {menuText} from '../lib/menu.ts'

test('a null or absent description is safe in both public menu languages', () => {
  for (const locale of ['hr', 'en']) {
    for (const description of [null, undefined, {}, {hr: null, en: null}]) {
      assert.equal(menuText(description, locale), '')
    }
  }
})

test('a missing translation falls back to the available language', () => {
  assert.equal(menuText({en: 'Coffee'}, 'hr'), 'Coffee')
  assert.equal(menuText({hr: 'Kava'}, 'en'), 'Kava')
  assert.equal(menuText({hr: ' ', en: 'Coffee'}, 'hr'), 'Coffee')
  assert.equal(menuText({hr: 'Kava', en: 'Coffee'}, 'hr'), 'Kava')
  assert.equal(menuText({hr: 'Kava', en: 'Coffee'}, 'en'), 'Coffee')
})

test('missing names use a display fallback without changing the source document', () => {
  const name = {en: ' ', hr: ''}
  assert.equal(menuText(name, 'hr', 'Proizvod bez naziva'), 'Proizvod bez naziva')
  assert.deepEqual(name, {en: ' ', hr: ''})
})
