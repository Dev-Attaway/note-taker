const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');

// functions are loaded from helpers/fsUtils'
// notes.js can now use the functions readFromFile, readAndAppend, and writeToFile
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

// DELETE Route for a specific note
notes.delete('/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all notes except the one with the ID provided in the URL
            const result = json.filter((note) => note.note_id !== noteId);
            // Save that array to the filesystem
            writeToFile('./db/db.json', result);
            // Respond to the DELETE request
            res.json(`Item ${noteId} has been deleted 🗑️`);
        });
});

// This API route is a GET Route for retrieving all the notes
// GET http://localhost:3001/api/notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// This API route is a POST Route for a new UX/UI tip
// POST http://localhost:3001/api/notes
notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    // deconsturcting the JSON object recieved through POST call
    // the JSON data with the names title and text are stored from that JSON data sent 
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        // write to the data base with the new note created through the POST
        readAndAppend(newNote, './db/db.json');
        const response = {
            status: 'success',
            body: newNote,
        };

        // displays the response with the unique uuid to the back-end
        res.status(201).json(response);
    }
    else
        res.json('Error in posting feedback');
});

module.exports = notes;
