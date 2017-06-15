const uuid = require('uuid');
const logger = require('./logger');

function requestLogger(loggerChildConfig, req, res, next) {
    const defaultChildConfig = { requestID: uuid.v4() };
    const finalConfig = Object.assign(defaultChildConfig, loggerChildConfig);

    req.logger = logger.child(finalConfig);

    req.logger.debug({ req }, 'Incoming request');

    res.set('X-Request-ID', id);

    next();
}

module.exports = requestLogger;
