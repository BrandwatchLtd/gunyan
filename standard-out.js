const safeCycles = require('bunyan').safeCycles;

const nameFromLevel = {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal'
};

const mapLevelToSeverity = {
    trace: 'DEBUG',
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARNING',
    error: 'ERROR',
    fatal: 'ALERT'
};

function StandardOut(options) {
    this.service = options.service;
    this.version = options.version;
    this.stream = options.stream || process.stdout;
}

StandardOut.prototype.write = function write(record) {
    const self = this;
    const outputRecord = Object.assign({}, record);

    if (record.err && record.err.stack) {
        outputRecord.message = record.err.stack;
    } else if (!outputRecord.message && record.msg) {
        outputRecord.message = record.msg;
    }

    if (outputRecord.message && outputRecord.msg) {
        delete outputRecord.msg;
    }

    outputRecord.timestamp = record.time || new Date().toISOString();
    outputRecord.severity = mapLevelToSeverity[nameFromLevel[record.level]] || 'DEFAULT';

    if (self.service && self.version) {
        outputRecord.serviceContext = {
            service: self.service,
            version: self.version
        };
    }

    self.stream.write(`${JSON.stringify(outputRecord, safeCycles())}\n`);
};


module.exports = StandardOut;
