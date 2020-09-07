const fs = require("fs");

module.exports = function(req,res,next) {
    if(!req.query['currentlywatching']) {
        return res.status(400).send({status: false, message: "No title provided"})
    } else {
        fs.readFile('config.json', (err, data) => {
            data = JSON.parse(data);
            data['currentlywatching'] = req.query['currentlywatching'];
            newdata = JSON.stringify(data, null, 2)
            fs.writeFile('config.json', newdata, (err) => {
                if (err) throw err;
            })
            console.log(`IP: ${req.ip} - Changed Currently Watching - ${data['currentlywatching']}`);
        })
    }
    
    return res.send({status: true, message: `Success!\nSet to "${req.query['currentlywatching']}"`})
}

