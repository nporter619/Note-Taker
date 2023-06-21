const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));


app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

const { v4: uuidv4 } = require('uuid');

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();

    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.status(200).send();
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);

        // Filter out the note with the given id
        notes = notes.filter(note => note.id !== noteId);

        // Write the filtered notes back to db.json
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.status(200).send();
        });
    });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));

