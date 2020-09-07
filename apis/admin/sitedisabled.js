const fs = require("fs");

configjson = './config.json'
module.exports = {
    post: function(req, res, next) {
        let query;
        if (!req.query['sitedisabled']) {
            return res.status(400).send({ status: false, message: "No bool provided", missing: "sitedisabled" })
        } else {
            if (req.query['sitedisabled'] == "false") {
                query = false;
            } else if (req.query['sitedisabled'] == "true") {
                query = true;
            }
            fs.readFile(configjson, (err, data) => {
                data = JSON.parse(data);
                data['sitedisabled'] = query;
                newdata = JSON.stringify(data, null, 2)
                fs.writeFile(configjson, newdata, (err) => {
                    if (err) throw err;
                })
            })
        }
        
        if (query) {
            console.log(`IP: ${req.ip} - Change Site State -  Disabled`);
            return res.send({ status: true, message: `Site Disabled`, disabled: true })
        } else if (!query) {
            console.log(`IP: ${req.ip} - Changed Site State - Enabled`);
            return res.send({ status: true, message: `Site Enabled`, disabled: false })
        } else {
            return res.send({ status: false, message: `uhhhhhhhhhh????` })
        }
    },
    get: function(req, res, next) {
        // console.log(config['sitedisabled'])
        if (JSON.parse(fs.readFileSync(configjson))['sitedisabled']) {
            // console.log("should be disabled")
            res.send({ status: true, message: `Site Disabled`, disabled: true })
        } else {
            // console.log("should be enabled")
            res.send({ status: true, message: `Site Enabled`, disabled: false })
        }
    }
}