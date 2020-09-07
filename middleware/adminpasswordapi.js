const fs = require("fs");
const md5 = require('md5')
const config = JSON.parse(fs.readFileSync('./config.json'))
const passwordmd5 = md5(config.adminpassword)

module.exports = function (req, res, next) {
    let query = req.query['adminauthkey'];
    if (!query) {
        console.log(`IP: ${req.ip} - ADMINPANEL - No Auth Key - ${req.query['authkey']}`);
        return res.status(400).send({status: null, message: "No key sent"})
    } else if(query == config.adminpassword){ 
        console.log(`IP: ${req.ip} - ADMINPANEL - Success`);
        res.cookie('adminauthkey', passwordmd5, {maxAge: 172800000})
        return res.send({status: true, redirect: '/admin', message: "Success"})
    } else if (query != config.adminpassword) {
        console.log(`IP: ${req.ip} - ADMINPANEL - Bad Auth Key - ${req.query['authkey']}`);
        return res.status(403).send({status: false, message: "Bad key"})
    }
    next()
};