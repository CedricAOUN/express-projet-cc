import express from 'express'
import { getAll, getById, create, updateById, deleteById } from './store.js'

const app = express()
app.use(express.json())
app.set('view engine', 'ejs')
app.use('/public', express.static('public'))

app.get('/api/v1/whisper', async (req, res) => {
  res.json(await getAll())
})

app.get('/api/v1/whisper/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const whisper = await getById(id)
  if (!whisper) {
    res.sendStatus(404)
  } else {
    res.json(whisper)
  }
})

app.post('/api/v1/whisper', async (req, res) => {
  const { message } = req.body
  if (!message) {
    res.sendStatus(400)
  } else {
    const whisper = await create(message)
    res.status(201).json(whisper)
  }
})

app.put('/api/v1/whisper/:id', async (req, res) => {
  const { message } = req.body
  const id = parseInt(req.params.id)
  if (!message) {
    res.sendStatus(400)
  } else {
    const whisper = await getById(id)
    if (!whisper) {
      res.sendStatus(404)
    } else {
      await updateById(id, message)
      res.sendStatus(200)
    }
  }
})

app.delete('/api/v1/whisper/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const whisper = await getById(id)
  if (!whisper) {
    res.sendStatus(404)
    return
  }
  await deleteById(id)
  res.sendStatus(200)
})

app.get('/', async (req, res) => {
  res.render('index', { title: 'Home Page', whispers: await getAll() })
})

app.get('/about', async (req, res) => {
  const whisperCount = (await getAll()).length
  res.render('about', { title: 'About Page', whisperCount })
})

export { app }
