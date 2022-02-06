const mongoose = require('mongoose')
const reqString = {type: String, required: true}

const songSchema = new mongoose.Schema({
    link: reqString,
    name: reqString,
    songId: reqString,
    path: reqString
})

module.exports = new mongoose.model('Song', songSchema)