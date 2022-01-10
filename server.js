const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node')
const cors = require('cors')
const bodyParser = require('body-parser')
const lyricsFinder = require('lyrics-finder')

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/refresh-authtoken', (req, res) => {

    const refreshToken = req.body.refreshToken;
    console.log("refresh-authtoken.....", refreshToken)
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '3161af22a7714180bef6dbfe9a6fec9f',
        clientSecret: '',
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400)
        })
})

app.post('/auth-token', (req, res) => {
    console.log("auth-token.....")
    const code = req.body.code;

    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '3161af22a7714180bef6dbfe9a6fec9f',
        clientSecret: ''
    })
    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
        })
    })
        .catch(error => {
            console.log(error)
            res.sendStatus(400)
        })
})

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track)
        || "No lyrics found"
    res.json({ lyrics })
})


app.listen(3001)