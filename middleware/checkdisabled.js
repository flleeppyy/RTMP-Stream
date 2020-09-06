const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./config.json'));
const sitedisabled = config['sitedisabled'];

let init = function(req, res, next) {
    if (!JSON.parse(fs.readFileSync('./config.json'))['sitedisabled']) {
        return next();
    } else {
        return res.status(503).redirect('/disabled')
    }
}

module.exports = init;