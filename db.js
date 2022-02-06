require('dotenv').config()
const mongoose = require('mongoose')

const dbUri = process.env.DB_URI

const db = mongoose.connect(dbUri, 
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log("Connected to MongoDB"))


module.exports = db;