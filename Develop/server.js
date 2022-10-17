const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(`${req.method} request received to get reviews`)
});

app.post('/api/notes', (req, res) => {
    res.json(`${req.method} request received to get reviews`)
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);