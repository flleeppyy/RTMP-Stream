const fs = require('fs')
const path = require('path')

let init = function (req, res, next) {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, "../data.json")))
    res.send(data);
}

module.exports = init;