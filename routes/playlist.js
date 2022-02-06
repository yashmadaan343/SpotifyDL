require('dotenv').config()
const router = require('express').Router();
const Playlist = require('../models/playlistSchema')


router.get('/:playlistId', async (req, res) => {
    const playlistId = req.params.playlistId
    const playlist = await Playlist.findOne({ playlistId: playlistId })
    console.log(playlist, "Found one")
    if(!playlist){
        res.send("Not found")
    }else{
        const filePath = `${__dirname}/../${playlist.path}.tar`
        res.download(filePath)
    }
})

module.exports = router;