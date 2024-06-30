const fs = require('fs');

module.exports = {
    logError: function (commandName, error) {
        const logEntry = {
            command: commandName,
            error: error.message,
            stack: error.stack,
            time: new Date().toISOString()
        };

        console.error(`Error in command ${commandName}:`, error);

        const logFilePath = './data/error_log.json';
        const errorLog = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'));
        errorLog.push(logEntry);
        fs.writeFileSync(logFilePath, JSON.stringify(errorLog, null, 2));
    }
};
