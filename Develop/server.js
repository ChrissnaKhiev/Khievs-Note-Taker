const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
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
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      const noteString = JSON.parse(data);
      res.json(noteString);
    });
    console.info(`${req.method} request received for notes`);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);

    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
          } else {
            const noteString = JSON.parse(data);
    
            noteString.push(newNote);

            fs.writeFile(`./db/db.json`, JSON.stringify(noteString, null, 4), (err) => err
              ? console.error(err)
              : console.log(
                  `Note for ${newNote.title} has been written to JSON file`)
            );
          }
        });
        
        const response = {
        status: 'success',
        body: newNote,
        };
    
        console.log(response);
        res.status(201).json(response);
    }else {
        res.status(500).json('Error in posting note');
    }
});

app.get('/api/notes/:id', (req, res) =>
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    const noteString = JSON.parse(data);
    res.json(noteString[req.param.id]);
  }
));

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);