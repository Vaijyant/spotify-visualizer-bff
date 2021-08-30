const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();
app.use(cors())
app.use(bodyParser.json());


app.post('/refresh', (req, res) => {
    
    const refreshToken = req.body.refreshToken;
    console.log("Refresh.....", refreshToken)
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '',
        clientSecret: '',
    })
    spotifyApi.setRefreshToken(refreshToken);
    
    spotifyApi
        .refreshAccessToken()
        .then(data => {
          console.log(data);
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400)
        })
})

app.post('/login',  (req, res) => {
    console.log("Login.....")
    const code = req.body.code;
    spotifyApi.setRefreshToken(req.body.refreshToken);
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '',
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


app.listen(3001)