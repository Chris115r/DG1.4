const fs = require('fs');
const path = require('path');
const errorLogFilePath = path.join(__dirname, 'error_log.json');

// Function to log errors
function logError(error, commandName, client) {
    const errorEntry = {
        timestamp: new Date().toISOString(),
        error: error.message,
        commandName,
        clientId: client ? client.user.id : null
    };

    let errorLog = [];
    if (fs.existsSync(errorLogFilePath)) {
        const data = fs.readFileSync(errorLogFilePath);
        errorLog = JSON.parse(data);
    }

    errorLog.push(errorEntry);
    fs.writeFileSync(errorLogFilePath, JSON.stringify(errorLog, null, 2));

    console.error(`Error logged: ${error.message}`);
}

module.exports = {
    logError
};
