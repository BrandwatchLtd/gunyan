const onHeaders = require('on-headers');

function responseLogger(req, res, next) {
    const t0 = Date.now();

    onHeaders(res, () => {
        res.setHeader('X-Response-Time', `${Date.now() - t0}ms`);
        req.logger.debug({ res }, 'Outgoing response');
    });

    next();
}

module.exports = responseLogger;
