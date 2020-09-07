//Look into this for authentication https://firebase.google.com/
NODE_NO_WARNINGS = 1;
const fs = require("fs");
const path = require("path");
const md5 = require('md5')

const express = require("express");
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')

// Admin api
const admincookiecheck = require('./apis/admin/admincookiecheck')
const adminpasswordapi = require('./apis/admin/adminpasswordapi')
const changesitepassword = require('./apis/admin/changesitepassword')
const adminsitedisabled = require('./apis/admin/sitedisabled')

const passwordapi = require('./middleware/passwordapi')
const cookiecheck = require('./middleware/cookiecheck')

const checkdisabled = require('./middleware/checkdisabled')
    // const utils = require('./modules/utils');
let config = JSON.parse(fs.readFileSync('./config.json'))
const cookieParser = require('cookie-parser');
const sitedisabled = require("./middleware/disabled");
const changecurrentlywatching = require("./apis/admin/changecurrentlywatching");

const passwordmd5 = md5(config['mainpassword'])

let currentlywatching;
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('trust proxy', 1);
app.use(helmet({
    contentSecurityPolicy: false,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { status: false, message: "Too many requests, please try again after 15 minutes" },
    onLimitReached: function(req, res, options) {
        console.log(`IP: ${req.ip} - Too many requests - Rate Limited`);
    }
});

app.use('/resources', express.static(__dirname + '/public/resources'))
app.get('/disabled', sitedisabled.get)
app.post('/disabled', sitedisabled.post)

app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'public/favicon.ico')))

app.get(['/admin', '/api/admin'], (req, res) => {
    fs.readFile('./config.json', (err, data) => {
        const adminpasswordmd5 = md5(JSON.parse(data)['adminpassword'])
        if (req.cookies['adminauthkey'] != adminpasswordmd5) {
            if (req.cookies['adminauthkey'] != undefined) {
                console.log(`IP: ${req.ip} - ADMINPANEL - Bad cookie - ${req.cookies['authkey']}`);
            }
            res.clearCookie('adminauthkey')
            res.sendFile(path.join(__dirname, './adminpanel/password.html'))
        } else {
            res.sendFile(path.join(__dirname, './adminpanel/panel.html'));
        }
    })
})


app.post('/password/submit/admin', limiter)
app.post('/password/submit/admin', adminpasswordapi)
app.use('/api/admin', admincookiecheck)

/**
 * @param {string} key The key in the config you want to change
 * @param {string} value the value of the key you want to change
 * @param {string} logmessage The message to log in console. ("Changed " + logmessage)
 * @param {boolean} logvalue Whether to log the value of what was changed, or not
 * @param {boolean} req Express Request - OPTIONAL
 */
function editconfig(key, value, logmessage, logvalue, req, res) {
    if (!key || !value || !logmessage || !logvalue) {
        throw "Did not specify one of the required values"
    }

    fs.readFile('config.json', (err, data) => {
                data = JSON.parse(data);
                data[key] = value;
                newdata = JSON.stringify(data, null, 2)
                fs.writeFile('config.json', newdata, (err) => {
                    if (err) throw err;
                })
                if (err) throw err;
                console.log(`IP: ${(req ? req.ip : "?")} - Changed ${logmessage}${(logvalue ? ` - ${value}` : "")}`);

    })
}

// app.get('/api/test12', (req, res) => {
//     req.send(editconfig('testkey1', 'teetetasfa', "testkey1", true, req))
// })

app.post('/api/admin/changesitepassword', changesitepassword)
app.post('/api/admin/changecurrentlywatching', changecurrentlywatching)
app.get('/api/admin/sitedisabled', adminsitedisabled.get)
app.post('/api/admin/sitedisabled', adminsitedisabled.post)

app.use(checkdisabled)

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
app.post('/password/submit', passwordapi)

app.use(cookiecheck) // DO NOT MOVE THIS, PLACE EVERYTHING YOU WANT PLACED BEHIND A PASSWORD WALL, AFTER THIS LINE

function cabfa() {
    fs.readFile("./config.json", (err, data) => {
        if (err) throw err;
        currentlywatching = JSON.parse(data)['currentlywatching'];
    })
}

cabfa()
setInterval(cabfa, 30000)
app.get('/api/currentlywatching', (req, res) => res.send({currentlywatching: currentlywatching}))

app.use('/stream', express.static(__dirname + '/public/stream')) // Static route; DO NOT ADD TRAILING SLASH IN EXPRESS.STATIC
app.use('/', express.static(__dirname + '/public'))
app.get('/stream/stream.m3u8', (req, res) => res.sendFile(path.join(__dirname, './public/stream/.m3u8'), { dotfiles: 'allow', hidden: true  })) // Just for extra measure
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