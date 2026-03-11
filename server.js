const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const ejs = require('ejs');
const dotenv = require('dotenv');

dotenv.config();

app.set('view engine', 'ejs');
app.use('/styles', express.static('styles'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});