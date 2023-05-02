const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const databasePath = "./db/db.json"

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// static specifies the default location if no route is specified in this case it's the public directory
app.use(express.static('public'));

app.get('/notes', (req,res) => {
    // when the get notes button is clicked the browser is told through the html to look for a (/notes) through href
    // express lookes through the gets and if ther is one with (/notes) it connects it to the backend which is written here
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.get('/api/notes', (req,res) => {
    // read the database file and return the json object as well as the status
    fs.readFile(databasePath, 'utf-8', (err, data) => {
        res.json(JSON.parse(data)).status(200);
    })
})

app.post("/api/notes", (req,res) => {
    // get the new note from the body
    // const note = JSON.parse(req.body);    
    const {title, text} = req.body;

    // create a new object with the given title and text and include an id for the note
    const newObject = {title: title, text: text, id: crypto.randomUUID()}

    // read the databse file
    fs.readFile(databasePath, 'utf-8',(err, data) => 
    {
        if (err) console.error(err)
        else{
            // parse to json everything in the database file currently
            const db = JSON.parse(data);
            
            // add the new object to the database file
            db.push(newObject);

            // write to the database the modified version which also includes the new note 
            // also send the status code if there is no error
            fs.writeFile(databasePath,JSON.stringify(db, null, '\t'), (err) =>{
                if (err) console.error(err); 
                else
                {
                    const response = {status: "success", body: newObject}
                    res.status(201).json(response);
                }
                
            })
        }
    })
})

app.listen(PORT, () =>{
    console.info(`listening on port #:${PORT}`)
})