const path = require("path");
const fs = require("fs");
const md5 = require('md5');
const config = JSON.parse(fs.readFileSync('./config.json'));
const passwordmd5 = md5(config['mainpassword']);
const passwordplain = config['mainpassword'];
module.exports = function(req, res, next) {
    if (!JSON.parse(fs.readFileSync('./config.json'))['sitedisabled']) {
        let query = req.query['authkey'];
        if (query == "admin") {
            return res.send({ status: true, redirect: '/admin', message: "Admin Redirect" })
        }
        if (!query) {
            console.log(`IP: ${req.ip} - No Auth Key - ${req.query['authkey']}`);
            return res.status(400).send({ status: null, message: "No key sent" });
        } else if (query == passwordplain) {
            console.log(`IP: ${req.ip} - Success`);
            res.cookie('authkey', passwordmd5, { maxAge: 172800000 });
            return res.send({ status: true, redirect: '/', message: "Success" });
        } else if (query != passwordplain) {
            console.log(`IP: ${req.ip} - Bad Auth Key - ${req.query['authkey']}`);
            return res.status(403).send({ status: false, message: "Bad key" });
        }
    } else {
        // console.log('tryed to access disabled')

        return res.status(503).redirect('/').sendFile(path.join(__dirname, '../password/disabled.html'));
    }
    next()
};