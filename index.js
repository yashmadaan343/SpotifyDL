require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const downloadRoute = require("./routes/downloader");
const songRoute = require("./routes/song");
const playlistRoute = require("./routes/playlist");
const db = require("./db");

db

app.set('view engine', 'ejs');    
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.render('index')
})

app.use("/download", downloadRoute)
app.use("/song", songRoute)
app.use("/playlist", playlistRoute)
  


app.listen(5000, ()=>{
  console.log("Listening on port http://localhost:5000")
})


