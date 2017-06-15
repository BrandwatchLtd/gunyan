const { extractKeyFromMessage } = require('@brandwatch/amqp');
const logger = require('./logger');

function workerLogger(msg) {
    let key;
    try {
        key = extractKeyFromMessage(msg);
    } catch (err) {
        logger.error(msg, 'Invalid message');
        msg.reject();
        throw err;
    }
    const loggerChildConfig = { exportId: key };

    if (process.env.NODE_ENV === 'production') {
        loggerChildConfig.context = {
            user: key
        };
    }

    return Object.assign({ logger: logger.child(loggerChildConfig) }, msg);
}

module.exports = workerLogger;
