const fs = require('fs');
const path = require('path');
const express = require('express');
const { notes } = require('./db/db.json');
const router = require('express').Router();

const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());
// link front end files needed to the front end pages requesting them
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


function createNewNote (body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes :notesArray }, null, 2)
    );

    // return finished code to post route for response
    return note;
};


function deleteNote (id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
        }
    }
}


app.get('/notes', (req, res) => {
    let results = notes;
    res.json(results);
});


app.delete('/api/notes/:id', (req, res) => {
        deleteNote(req.params.id, notes);
        res.json(true);
});


app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();
    
    const note = createNewNote(req.body, notes);
    res.json(note);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});