const fs = require("fs");

module.exports = function(req, res, next) {
    if (!JSON.parse(fs.readFileSync('./config.json'))['sitedisabled']) {
        return next();
    } else {
        return res.status(503).redirect('/disabled')
    }
}