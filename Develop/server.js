const express = require('express');
const path = require('path');

// Helper function for generating unique ids
const uuid = require('./helpers/uuid');
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// GET /notes should return the notes.html file.
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// This API route is a GET Route for retrieving all the tips
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// This API route is a POST Route for a new UX/UI tip
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.info(req.body);

  const { title, text } = req.body;

  console.log(title);

  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    console.log(newNote);

    const response = {
      status: 'success',
      body: newNote,
    };
    console.log(response);

    res.status(201).json(response);
  }
  else {
    res.json('Error in posting feedback');
  }

});

//GET * should return the index.html file
app.get('*', (req, res) => {
  console.info(`${req.method} request failed rerouting to homepage`);
  res.sendFile(path.join(__dirname, 'public/index.html'))
});



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
