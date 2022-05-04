const express = require('express');
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// API GET Request
app.get("/api/notes", (req, res) => {
        
    // Read 'db.json' file 
    let dataRead = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    
    // Send read data to response of 'GET' request
    res.json(dataRead);
});

// API POST Request
app.post("/api/notes", (req, res) => {

    // Extracted new note from request body.  
    const newNote = req.body;
    
    // Assigned unique id obtained from 'uuid' package
    newNote.id = uuidv4();
     
    // Read data from 'db.json' file
    let dataRead = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    // Pushed new note in 'db.json'
    dataRead.push(newNote);

    // Written notes data to 'db.json' file
    fs.writeFileSync('./db/db.json', JSON.stringify(dataRead));
    
    console.log("Successfully added new note!!!");

    // Send response
    res.json(dataRead);
});

// API DELETE request
app.delete("/api/notes/:id", (req, res) => {

    // Fetched id to delete
    let noteIdNumber = req.params.id.toString();
    
    // Read data from 'db.json' file
    let dataRead = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    // filter data to get notes except the one to delete
    const newData = dataRead.filter( note => note.id.toString() !== noteIdNumber );
    
    // Write new data to 'db.json' file
    fs.writeFileSync('./db/db.json', JSON.stringify(newData));
    
    console.log(`Successfully deleted note!!! `);

    // Send response
    res.json(newData);
});

app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });