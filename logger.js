const bunyan = require('bunyan');
const StandardOut = require('./standard-out');

function loggerFactory({
  logLevel=process.env.LOG_LEVEL || 'info',
  logName=process.env.LOG_NAME,
  logVersion=process.env.VERSION
  production=process.env.NODE_ENV === 'production'
} = {}) {

  assert(logName, 'logName is required');
  assert(logVersion, 'logVersion is required');

  const serializers = {
      res: function logResponse(res) {
          if (!res || !res.statusCode) {
              return res;
          }

          return {
              statusCode: res.statusCode,
              header: res._headers || res._header
          };
      }
  };

  const loggerConfig = {
      name: logName,
      serializers: Object.assign({}, bunyan.stdSerializers, serializers),
      streams: []
  };

  if (production) {
      loggerConfig.streams.push({
          type: 'raw',
          level: logLevel,
          stream: new StandardOut({
              service: logName,
              version: logVersion
          })
      });
  } else {
      loggerConfig.streams.push({
          type: 'stream',
          level: logLevel,
          stream: process.stdout
      });
  }

  return bunyan.createLogger(loggerConfig);
};

module.exports = loggerFactory;
