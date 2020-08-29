const fs = require("fs");
const os = require("os");
const path = require("path");
const md5 = require('md5')

const express = require("express");
const app = express();
const helmet = require('helmet');

const utils = require('./modules/utils.js');
const config = require('./config.js');
const cookieParser = require('cookie-parser');
const { query } = require("express");

const passwordmd5 = md5(config.password)
console.log(passwordmd5);

app.use(cookieParser())
//app.set('trust proxy', 1);
//app.use(helmet());
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'public/favicon.ico'))) // Just for extra measure
app.get('/password', (req, res) => {
    if(req.cookies['authkey'] != passwordmd5) { 
        res.sendFile(path.join(__dirname, './password/index.html'))
    } else {
        res.redirect('/')
    }
})
app.get('/password/submit', (req, res) => {
    console.log(req.query['authkey'])
    let query = req.query['authkey'];
    if (!query) {
        console.log('noauthkey');
        res.status(400).send(req.param.authkey)
    } else if(query == config.password){ 
        console.log('correct');
        res.cookie('authkey', passwordmd5, {maxAge: 172800000})
        res.redirect('/')
    } else if (query != config.password) {
        console.log('badauthkey');
        res.status(403).send('403: Bad authkey, please try again')
    }
    
})
app.use((req, res, next) => {
    //console.log(req.cookies)
    
    if(!req.cookies['authkey']) {
        return res.redirect('/password')
    } else if(req.cookies['authkey'] != passwordmd5) {
        res.cookie('authkey', '')
        return res.redirect('/password')
    }
    
    next()
})
app.use('/stream', express.static(__dirname + '/public/stream')) // Static route; DO NOT ADD TRAILING SLASH IN EXPRESS.STATIC
app.use('/', express.static(__dirname + '/public'))
app.get('/stream/stream.m3u8', (req, res) => res.sendFile(path.join(__dirname, './public/stream/.m3u8'), { hidden: true })) // Just for extra measure
app.get('/', (req, res) => { // The index page
    //console.log(req.cookies)
    try {
        console.info(`IP: ${req.ip} Requested ${req.url}`) // just do some logging
        res.sendFile(path.join(__dirname, 'public/index.html'))
    } catch (error) {
        console.error(`IP: ${req.ip} recieved error: ${error}`) // just do some logging
        res.status(404).sendFile(path.join(__dirname, 'public/404.html')) // show an error page (just sending pure html text wont cut it)
    }
});

app.listen(config.port, console.log(`Listening on http://localhost:${config.port} or http://127.0.0.1:${config.port}`))

