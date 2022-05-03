const express = require('express');
const fs = require("fs");
const path = require('path');

const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// API GET Request
app.get("/api/notes", (req, res) => {
        
    console.log("Executing GET notes request");
    // Read 'db.json' file 
    let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    
    console.log("GET request - Returning notes data: " + JSON.stringify(data));
    // Send read data to response of 'GET' request
    res.json(data);
});

// API POST Request
app.post("/api/notes", (req, res) => {

    // Extracted new note from request body.  
    const newNote = req.body;
    
    console.log("POST request - New Note : " + JSON.stringify(newNote));
     
    // Read data from 'db.json' file
    let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    // Pushed new note in notes file 'db.json'
    data.push(newNote);

    // Written notes data to 'db.json' file
    fs.writeFileSync('./db/db.json', JSON.stringify(data));
    
    console.log("Successfully added new note to 'db.json' file!");

    // Send response
    res.json(data);
});

// API DELETE request
app.delete("/api/notes/:id", (req, res) => {

    // Fetched id to delete
    let noteId = req.params.id.toString();
    
    console.log(`DELETE note request for noteId: ${noteId}`);

    // Read data from 'db.json' file
    let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

    // filter data to get notes except the one to delete
    const newData = data.filter( note => note.id.toString() !== noteId );

    // Write new data to 'db.json' file
    fs.writeFileSync('./db/db.json', JSON.stringify(newData));
    
    console.log(`Successfully deleted note with id : ${noteId}`);

    // Send response
    res.json(newData);
});

app.get('/notes', function(req, res) {
    
    console.log("Note",path.join(__dirname, '../public/notes.html'));
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

// app.get('/', function(req, res) {
//     // console.log("HTML",path.join(__dirname, '../public/index.html'));
//     res.sendFile(path.join(__dirname, '../public/index.html'));
// });

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
  });