# SpotiDL

SpotiDL is a free program which you can install and use easily to download spotify songs and playlists for offline usage without premium.

### Dependencies
* Node.js (https://nodejs.org/en/download/)

* FFMPEG (https://www.ffmpeg.org/download.html)

### Installing
* Download the zip file from github or if you have git clone you can run 
```git clone git@github.com:AlightKnight343/spotify-downloader.git```
* Download FFMPEG.
* Go to .example.env and change its name to .env
* Put in your spotify API client ID and client Secret and your relative FFMPEG Path. 

### Executing program
* Open command prompt window in the directory.
* Run ```npm i```
* Now, copy the link of the spotify song/playlist you want to download.
* Run the following command
```
node index.js spotify-link
```
* Your track/playlist will be downloaded in a few moments depending on length of track or number of songs.


## Help
There is no help command yet, I am still working on it. In case of any bugs please DM me on Discord (General Kenobi#6680)

## Authors
Yash Madaan (General Kenobi#6680)

## Version History

* 0.1
    * Initial Release
