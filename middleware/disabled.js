const fs = require('fs');
const path = require('path')

module.exports = {
    get: function(req, res, next) {
        if (JSON.parse(fs.readFileSync('./config.json'))['sitedisabled']) {
            // console.log(config['sitedisabled'])
            res.status(503).sendFile(path.join(__dirname, '../password/disabled.html'));
        } else {
            res.redirect('/')
        }
    },

    post: function(req,res,next){
        if (JSON.parse(fs.readFileSync('./config.json'))['sitedisabled']) {
            // console.log(config['sitedisabled'])
            return res.status(200).send({ status: true, message: "Site disabled", sitedisabled: true })
        } else {
            return res.status(200).send({ status: true, message: "Site enabled", sitedisabled: false })
        }
    }
}