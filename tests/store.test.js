import { getAll, getById, create, updateById, deleteById } from '../store.js'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'db.json')
const restoreDb = () => writeFileSync(dbPath, JSON.stringify([]))
const populateDb = (data) => writeFileSync(dbPath, JSON.stringify(data))
const fixtures = [{ id: 1, message: 'Hello World' }, { id: 2, message: 'Hello Again' }]
const inventedId = 999
const existingId = fixtures[0].id

describe('store', () => {
  beforeEach(() => populateDb(fixtures))
  afterAll(() => restoreDb())

  describe('getById', () => {
    it('should return empty array if no data', async () => {
      restoreDb()
      const data = await getAll()
      expect(data).toEqual([])
    })

    it('should return all data', async () => {
      const data = await getAll()
      expect(data).toEqual(fixtures)
    })
  })

  describe('getById', () => {
    it('should return undefined if id does not exist', async () => {
      const data = await getById(inventedId)
      expect(data).toBeUndefined()
    })
    it('should return correct item if id exists', async () => {
      const data = await getById(existingId)
      expect(data).toEqual(fixtures[0])
    })
  })

  describe('create', () => {
    it('should create new item', async () => {
      const message = 'New Message'
      const newItem = await create(message)
      expect(newItem).toEqual({ id: 3, message })
    })
    it('should add item to the db', async () => {
      const newItem = { id: fixtures.length + 1, message: 'test-3' }
      const { id } = await create(newItem.message)
      const item = await getById(id)
      expect(item).toEqual(newItem)
    })
  })

  describe('updateById', () => {
    it('should return undefined if id does not exist', async () => {
      const result = await updateById(inventedId, 'Updated Message')
      expect(result).toBeUndefined()
    })
    it('should not return item directly', async () => {
      const result = await updateById(existingId, 'Updated Message')
      expect(result).toBeUndefined()
    })
    it('should update item in the db', async () => {
      const newMessage = 'Updated Message'
      await updateById(existingId, newMessage)
      const updatedItem = await getById(existingId)
      expect(updatedItem).toEqual({ id: existingId, message: newMessage })
    })
  })

  describe('deleteById', () => {
    it('should return undefined if id does not exist', async () => {
      const result = await deleteById(inventedId)
      expect(result).toBeUndefined()
    })
    it('should not return item directly', async () => {
      const result = await deleteById(existingId)
      expect(result).toBeUndefined()
    })
    it('should delete item from the db', async () => {
      await deleteById(existingId)
      const items = await getAll()
      expect(items).toEqual(fixtures.filter(item => item.id !== existingId))
    })
  })
})
