module.exports = function(req, res, next) {
    if (!req.query['password']) {
        return res.status(400).send({ status: false, message: "No password provided" })
    } else {
        fs.readFile('config.json', (err, data) => {
            data = JSON.parse(data);
            data['mainpassword'] = req.query['password'];
            newdata = JSON.stringify(data, null, 2)
            fs.writeFile('config.json', newdata, (err) => {
                if (err) throw err;
            })
            console.log(`IP: ${req.ip} - Changed Password - ${data['mainpassword']}`);
        })
    }
    return res.send({ status: true, message: `Success` })
}