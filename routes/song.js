require('dotenv').config()
const router = require('express').Router();
const Song = require('../models/songSchema')


router.get('/:songId', async (req, res) => {
    const songId = req.params.songId
    const song = await Song.findOne({ songId: songId })
    console.log(song)
    if(!song){
        res.send("Not found")
    }else{
        const filePath = `${__dirname}/../${song.path}`
        res.download(filePath)
    }
})

module.exports = router;