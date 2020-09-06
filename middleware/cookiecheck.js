const fs = require("fs");
const cookieParser = require('cookie-parser');
const md5 = require('md5')
const config = JSON.parse(fs.readFileSync('./config.json'))
const passwordmd5 = md5(config['mainpassword'])

let init = function (req, res, next) {
    if(!req.cookies['authkey']) {
        return res.redirect('/password')
    } else if(req.cookies['authkey'] != passwordmd5) {
        if (req.cookies['authkey'] != undefined) {
            console.log(`IP: ${req.ip} - Bad cookie - ${req.cookies['authkey']}`);
        }
        res.clearCookie('authkey');
        return res.redirect('/password');
    }
    next();
}

module.exports = init;