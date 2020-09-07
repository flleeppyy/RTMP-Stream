const fs = require("fs");
const md5 = require('md5');

module.exports = function(req, res, next) {
    fs.readFile('./config.json', (err, data) => {
        if(err) throw err
        const config = (JSON.parse(data))
        const passwordmd5 = md5(config['mainpassword']);
        if (!config['sitedisabled']) {
            if (!req.cookies['authkey']) {
                return res.redirect('/password')
            } else if (req.cookies['authkey'] != passwordmd5) {
                
                if (req.cookies['authkey'] != undefined) {
                    console.log(`IP: ${req.ip} - Bad cookie - ${req.cookies['authkey']}`);
                }
                res.clearCookie('authkey');
                return res.redirect('/password');
            }
        } else {
            return res.status(503).redirect('/')
        }
        next();
    })
    
}
