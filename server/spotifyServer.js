const express = require('express');
const { access } = require('fs');
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyWebApi = require ('spotify-web-api-node');

const app = express ();

app.post('/music-feed', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000/music-feed',
        clientId: 'b62260a3ef7c4085b1748b7fef3bd3d6',
        clientSecret: 'c2c4e138e51c449cbc942a8e779885d3'
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        resizeBy.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch(() => {
        res.sendStatus(400)
    })
})

