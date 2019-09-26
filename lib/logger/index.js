const winston = require('winston')
const moment = require('moment')
const path = require('path')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ 
      filename: `${moment().format('YYYY-MM-DD')}.error.log`,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 3,
      dirname: path.resolve(__dirname, '..', '..', 'log', 'tools-git'),
      level: 'warn' 
    }),
    new winston.transports.File({ 
      filename: `${moment().format('YYYY-MM-DD')}.info.log`, 
      maxsize: 10 * 1024 * 1024,
      dirname: path.resolve(__dirname, '..', '..', 'log', 'tools-git'),
      maxFiles: 3,
      level: 'debug' 
    })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
