const mongoose = require('mongoose')
const reqString = {type: String, required: true}

const playlistSchema = new mongoose.Schema({
    link: reqString,
    name: reqString,
    playlistId: reqString,
    path: reqString
})

module.exports = new mongoose.model('Playlist', playlistSchema)