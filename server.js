import express from 'express'
import { getAll, getById, create, updateById, deleteById } from './store.js'

const app = express()
app.use(express.json())
app.set('view engine', 'ejs');
app.use("/public", express.static('public'));

app.get('/api/v1/whisper', async (req, res) => {
    res.json(await getAll())
})

app.get('/api/v1/whisper/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    res.json(await getById(id))
})

app.post('/api/v1/whisper', async (req, res) => {
    res.status(201).json(await create(req.body.message))
})

app.put('/api/v1/whisper/:id', async (req, res) => {
    await updateById(parseInt(req.params.id), req.body.message)
    res.sendStatus(200)
})

app.delete('/api/v1/whisper/:id', async (req, res) => {
    await deleteById(parseInt(req.params.id))
    res.sendStatus(200)
})

app.get('/', async (req, res) => {
    res.render('index', { title: 'Home Page', whispers: await getAll() });
});

app.get('/about', async (req, res) => {
    const whisperCount = (await getAll()).length;
    res.render('about', { title: 'About Page', whisperCount });
});

export { app }