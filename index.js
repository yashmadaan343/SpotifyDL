require('dotenv').config()
const SpotifyToYoutube = require('spotify-to-youtube')
const SpotifyWebApi = require('spotify-web-api-node')
const DownloadYTFile = require('yt-dl-playlist')
const fs = require('fs');
const getVideoId = require('get-video-id');
const argv = require('minimist')(process.argv.slice(2));
var inputUrl = argv._[0];
const spotifyUri = require('spotify-uri');
const spotifyToYT = require("spotify-to-yt");

//new spotify web api
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

async function main() {
  const credsResponse = await spotifyApi.clientCredentialsGrant()
  spotifyApi.setAccessToken(credsResponse.body['access_token'])
  const spotifyToYoutube = SpotifyToYoutube(spotifyApi)
  try {
    const trackOrPlaylist = await spotifyToYT.isTrackOrPlaylist(inputUrl)
    if (trackOrPlaylist == "track") {
      const downloader = new DownloadYTFile({
        outputPath: "./downloaded/",
        ffmpegPath: "./ffmpeg/bin/ffmpeg.exe",
        maxParallelDownload: 10,
        fileNameGenerator: (videoTitle) => {
          return videoTitle + ".mp3"
        }
      })

      const parsed = spotifyUri.parse(inputUrl);
      const id = await spotifyToYoutube(spotifyUri.formatURI(parsed))
      downloader.download(id, inputFileName = null)
        .then(console.log("Downloaded Song"))
    }
    else {
      const playlist = await spotifyToYT.playListGet(inputUrl)
      let playlistSongs = playlist.songs
      let dir = "./downloaded/" + playlist.info.name

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const downloader = new DownloadYTFile({
        outputPath: "./downloaded/" + playlist.info.name,
        ffmpegPath: "./ffmpeg/bin/ffmpeg.exe",
        maxParallelDownload: 10,
        fileNameGenerator: (videoTitle) => {
          return videoTitle + ".mp3"
        }
      })
      playlistSongs.forEach(songs => {
        const songid = getVideoId(songs).id
        console.log(songid);
        downloader.download(songid).then(console.log("downloaded playlist"))
      });
    }
  }
  catch (e) {
    console.log(e)
  }
};

//start main
if (inputUrl) {
  main()
}
else {
  console.log("Please enter A valid Spotify URL Read Docs For More Info")
}
