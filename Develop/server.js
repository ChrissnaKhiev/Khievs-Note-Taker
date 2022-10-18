const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
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
    res.json(`${req.method} request received to get notes`)
    console.info(`${req.method} request received for notes`);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);

    const {title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
          } else {
            // Convert string into JSON object
            const noteString = JSON.parse(data);
    
            // Add a new review
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

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);