require('dotenv').config()
const router = require('express').Router();

const Song = require('../models/songSchema')
const Playlist = require('../models/playlistSchema')

const mongoose = require('mongoose');
const SpotifyToYoutube = require('spotify-to-youtube')
const SpotifyWebApi = require('spotify-web-api-node')
const DownloadYTFile = require('yt-dl-playlist')
const fs = require('fs');
const getVideoId = require('get-video-id');
const spotifyUri = require('spotify-uri');
const spotifyToYT = require("spotify-to-yt");
const { nanoid } = require('nanoid');
const compressing = require('compressing');


//new spotify web api
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

router.post('/', async (req, res) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    const credsResponse = await spotifyApi.clientCredentialsGrant()
    spotifyApi.setAccessToken(credsResponse.body['access_token'])
    const spotifyToYoutube = SpotifyToYoutube(spotifyApi)
    try {
        const trackOrPlaylist = await spotifyToYT.isTrackOrPlaylist(req.body.link)

        if (trackOrPlaylist == "track") {
            let trackDetails = await spotifyToYT.trackGet(req.body.link)

            const songId = nanoid();

            const downloader = new DownloadYTFile({
                outputPath: "./downloaded/songs",
                ffmpegPath: "./ffmpeg/bin/ffmpeg.exe",
                maxParallelDownload: 10,
                fileNameGenerator: () => {
                    return trackDetails.info[0].title + songId + ".mp3"
                }
            })



            const parsed = spotifyUri.parse(req.body.link);
            const id = await spotifyToYoutube(spotifyUri.formatURI(parsed))
            downloader.download(id, inputFileName = null)
            const song = new Song({
                link: req.body.link,
                name: trackDetails.info[0].title,
                songId: songId,
                path: `downloaded/songs/${trackDetails.info[0].title}${songId}.mp3`
            })
            await song.save().then(async () => {
                await delay(3000) 
                res.render("song", { href: `/song/${songId}` })
            })
        }


        else {
            const playlist = await spotifyToYT.playListGet(req.body.link)
            let playlistSongs = playlist.songs
            const playlistId = nanoid()
            let dir = "./downloaded/playlists/" + playlist.info.name + playlistId;

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            const downloader = new DownloadYTFile({
                outputPath: dir,
                ffmpegPath: "./ffmpeg/bin/ffmpeg.exe",
                maxParallelDownload: 50,
                fileNameGenerator: (videotitle) => {
                    let songId = nanoid()
                    return videotitle + songId + ".mp3"
                }
            })
            playlistSongs.forEach(async songs => {
                const songid = getVideoId(songs).id
                console.log(songid);
                await downloader.download(songid).then(console.log('Playlist Downloaded'))
            });

            const playlistSchema = new Playlist({
                link: req.body.link,
                name: playlist.info.name,
                playlistId: playlistId,
                path: `downloaded/playlists/${playlist.info.name}${playlistId}`
            })
            await playlistSchema.save().then(async() => {
                await delay(3000) 
                res.render("playlist", { href: `/playlist/${playlistId}` })
            })


            const compressFunction = async () => {
                await delay(4000)
                const sourceDir = `./downloaded/playlists/${playlist.info.name}${playlistId}`;
                const destinationDir = `./downloaded/playlists/${playlist.info.name}${playlistId}.tar`;
                await compressing.tar.compressDir(sourceDir, destinationDir)
                    .then(console.log("compressed"))
                    .catch(err => console.log(err));
            }
            compressFunction()

        }
    }
    catch (e) {
        res.send(e)
    }

})
module.exports = router;