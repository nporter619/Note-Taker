// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// Create an express app
const app = express();
// Set the PORT for the app to listen on
const PORT = process.env.PORT || 3000;

// Set express to use JSON parsing and static files from the 'public' directory
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Route to serve the notes HTML file
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// Route to get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

// Import uuid to generate unique ids for notes
const { v4: uuidv4 } = require('uuid');

// Route to create a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();  // Generate a unique id for the new note

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

// Route to delete a note
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;  // Get the id of the note to be deleted

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

// Catch-all route to serve the index HTML file
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// Start the app and listen on the PORT
app.listen(PORT, () => console.log(`App listening on PORT: ${PORT}`));
