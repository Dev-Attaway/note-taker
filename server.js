const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

// process.env.PORT is used for vload hosting the server from Heroku
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// "Mounting" the routes from api onto the object: app
app.use('/api', api);

app.use(express.static('public'));

// GET /notes should return the notes.html file.
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET * should return the index.html file
app.get('*', (req, res) => {
  console.info(`${req.method} request failed rerouting to homepage`);
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

// displays the port which the application is running on 
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
