import { getAll, getById, create, updateById, deleteById } from '../store.js'
import { restoreDb, populateDb } from './utils.js'
import { whispers, inventedId, existingId } from './fixtures.js'

describe('store', () => {
  beforeEach(() => populateDb(whispers))
  afterAll(() => restoreDb())

  describe('getById', () => {
    it('should return empty array if no data', async () => {
      restoreDb()
      const data = await getAll()
      expect(data).toEqual([])
    })

    it('should return all data', async () => {
      const data = await getAll()
      expect(data).toEqual(whispers)
    })
  })

  describe('getById', () => {
    it('should return undefined if id does not exist', async () => {
      const data = await getById(inventedId)
      expect(data).toBeUndefined()
    })
    it('should return correct item if id exists', async () => {
      const data = await getById(existingId)
      expect(data).toEqual(whispers[0])
    })
  })

  describe('create', () => {
    it('should create new item', async () => {
      const message = 'New Message'
      const newItem = await create(message)
      expect(newItem).toEqual({ id: 3, message })
    })
    it('should add item to the db', async () => {
      const newItem = { id: whispers.length + 1, message: 'test-3' }
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
      expect(items).toEqual(whispers.filter(item => item.id !== existingId))
    })
  })
})
