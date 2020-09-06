const fs = require("fs");
const cookieParser = require('cookie-parser');
const md5 = require('md5')
const config = JSON.parse(fs.readFileSync('./config.json'))
const passwordmd5 = md5(config['adminpassword'])

let init = function (req, res, next) {
    if(!req.cookies['adminauthkey']) {
        return res.redirect('/admin')
    } else if(req.cookies['adminauthkey'] != passwordmd5) {
        if (req.cookies['adminauthkey'] != undefined) {
            console.log(`IP: ${req.ip} - Bad cookie - ${req.cookies['adminauthkey']}`);
        }
        res.clearCookie('adminauthkey');
        return res.redirect('/admin');
    }
    next();
}

module.exports = init;