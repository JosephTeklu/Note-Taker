// opening up packages
const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const databasePath = "./db/db.json"
// open up express and setup port
const app = express();
const PORT = process.env.PORT||3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
// static specifies the default location if no route is specified in this case it's the public directory
app.use(express.static('public'));

app.delete("/api/notes/:id", (req,res) => {
    // read the data base file
    fs.readFile(databasePath, 'utf-8', (err, data) => {

        // throw an error if there is one
        if (err) console.error(err)
        else{
            // new array for the new db file which excludes the deleted object
            var newDB = [];

            // parse to json everything in the database file currently
            const db = JSON.parse(data);
            
            // loop through the database
            for(i=0; i < db.length ; i++){
                // if the id of the current note is not the same as the id sent
                // add the note to the new id
                if(db[i].id !== req.params.id){
                    // push the current note to the new array
                    newDB.push(db[i]);
                }
            }

            fs.writeFile(databasePath,JSON.stringify(newDB, null, '\t'), (err) =>{
                if(err) console.error(err)
                else{
                // return status code
                res.sendStatus(202);
                }
            })
        }
    })
})



app.get('/notes', (req,res) => {
    // when the get notes button is clicked the browser is told through the html to look for a (/notes) through href
    // express lookes through the gets and if ther is one with (/notes) it connects it to the backend which is written here
    
    // send notes html to show on webpage 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
})

app.get('/api/notes', (req,res) => {
    // read the database file and return the json object with the status
    fs.readFile(databasePath, 'utf-8', (err, data) => {
        res.json(JSON.parse(data)).status(200);
    })
})

app.post("/api/notes", (req,res) => {
    // get the new note from the body of the request
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
            fs.writeFile(databasePath,JSON.stringify(db, null, '\t'), (err) =>{
                if (err) console.error(err); 
                else{
                    // response is set to be the new note with the staus
                    const response = {status: "success", body: newObject}
                    // return the status code and response
                    res.status(201).json(response);
                }
            })
        }
    })
})

// listen for allowing program to stay running
app.listen(PORT, () =>{
    console.info(`listening on port #:${PORT}`)
})