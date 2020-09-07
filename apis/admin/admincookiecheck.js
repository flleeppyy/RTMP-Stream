const fs = require("fs");
const md5 = require('md5')

module.exports = function (req, res, next) {
    const config = JSON.parse(fs.readFileSync('./config.json'))
    const passwordmd5 = md5(config['adminpassword'])
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