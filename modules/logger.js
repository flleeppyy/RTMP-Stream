const fs = require('fs')
const path = require('path')

module.exports = {
    /**
     * string: Content to log
     * 
     * type: type of content to log/prepend to log file
     * 
     * echolog: boolean - Echo log into console
     * Types: info, error, warning
     * 
     * Note: Will default type to "info" if no type is provided
     */
    log: function(string, type, echolog) {
        const types = ["info", "error", "warning"]
        if (!string) {
            throw ("No string provided")
        }
        if (types.includes(type)) {
            const a = `${Date()} [${type.toUpperCase()}] ${string}`
            fs.appendFile(path.resolve(__dirname, '../logs/log.log'), a + "\r\n", function(err) { if (err) throw err });
            if (echolog) console.log(a)
        } else if (!type) {
            const a = `${Date()} [NOTYPE] ${string}`
            fs.appendFile(path.resolve(__dirname, '../logs/log.log'), a + "\r\n", function(err) { if (err) throw err });
            if (echolog) console.log(a)
        } else {
            throw "Invalid type"
        }
    },

    /**
     * This function will log to console as well as logging to a file
     * string: Content to log
     * 
     * type: type of content to log/prepend to log file
     * 
     * Types: info, error, warning
     * 
     * Note: Will default type to "info" if no type is provided
     */
    logecho: function(string, type) {
        const types = ["info", "error", "warning"]
        if (!string) {
            throw ("No string provided")
        }
        if (types.includes(type)) {
            const a = `${Date()} [${type.toUpperCase()}] ${string}`
            fs.appendFile(path.resolve(__dirname, '../logs/log.log'), a + "\r\n", function(err) { if (err) throw err });
            console.log(a)
        } else if (!type) {
            const a = `${Date()} [NOTYPE] ${string}`
            fs.appendFile(path.resolve(__dirname, '../logs/log.log'), a + "\r\n", function(err) { if (err) throw err });
            console.log(a)
        } else {
            throw "Invalid type"
        }
    }
};