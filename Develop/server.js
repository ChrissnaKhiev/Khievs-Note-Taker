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

// const writeToFile = (destination, content) => 
// fs.writeFile(destination, JSON.stringify(content), (err) => err
// ? console.error(err)
// : console.log(
//     `Note for ${newNote.title} has been written to JSON file`)
// );

// const readAndAppend = (content, file) => {
//     fs.readFile(file, 'utf8', (err,data) => {
//         if (err) {
//             console.log(err);
//         }else {
//             const parseData = JSON.parse(data);
//             parseData.push(content);
//             writeToFile(file, parseData);
//         }
//     })
// }

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
    res.json(`${req.method} request received to post notes`);
    console.info(`${req.method} request received for notes`);

    const { title, text} = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        const noteString = JSON.stringify(newNote);

        fs.writeFile(`./db/db.json`, noteString, (err) => err
        ? console.error(err)
        : console.log(
            `Note for ${newNote.title} has been written to JSON file`)
        );

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