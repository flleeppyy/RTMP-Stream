const fs = require("fs");
const os = require("os");
const path = require("path");
const md5 = require('md5')

const express = require("express");
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')

const passwordapi = require('./middleware/passwordapi')
const cookiecheck = require('./middleware/cookiecheck')
const currentlywatching = require('./middleware/currentlywatching')
const utils = require('./modules/utils');
const config = require('./config');
const cookieParser = require('cookie-parser');

const passwordmd5 = md5(config.password)

app.use(cookieParser())
app.set('trust proxy', 1);
app.use(helmet({
    contentSecurityPolicy: false,
}));

const limiter = rateLimit(config.ratelimit);

app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'public/favicon.ico')))
app.get('/password', (req, res) => {
    if(req.cookies['authkey'] != passwordmd5) {
        if (req.cookies['authkey'] != undefined) {
            console.log(`IP: ${req.ip} - Bad cookie - ${req.cookies['authkey']}`);
        }
        res.clearCookie('authkey')
        res.sendFile(path.join(__dirname, './password/index.html'))
    } else {
        res.redirect('/')
    }
})
app.post('/password/submit', limiter)
app.get('/password/submit', passwordapi)
app.get('/api/currentlywatching', currentlywatching)

app.use(cookiecheck)

app.use('/stream', express.static(__dirname + '/public/stream')) // Static route; DO NOT ADD TRAILING SLASH IN EXPRESS.STATIC
app.use('/', express.static(__dirname + '/public'))
app.get('/stream/stream.m3u8', (req, res) => res.sendFile(path.join(__dirname, './public/stream/.m3u8'), { hidden: true })) // Just for extra measure
app.get('/', (req, res) => { // The index page
    try {
        console.info(`IP: ${req.ip} Requested ${req.url}`) // just do some logging
        res.sendFile(path.join(__dirname, 'public/index.html'))
    } catch (error) {
        console.error(`IP: ${req.ip} recieved error: ${error}`) // just do some logging
        res.status(404).sendFile(path.join(__dirname, 'public/404.html')) // show an error page (just sending pure html text wont cut it)
    }
});

app.listen(config.port, console.log(`Listening on http://localhost:${config.port} or http://127.0.0.1:${config.port}`))