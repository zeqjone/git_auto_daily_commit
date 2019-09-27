const winston = require('winston')
const {format} = winston;
const {combine, timestamp, printf, label} = format;
const moment = require('moment')
const path = require('path')

let myFormat = combine(
  timestamp({format: 'HH:mm:ss'}),
  label({label: 'gito'}),
  printf(({timestamp, label, level, message, ...rest}) => {
    let str = `- ${timestamp} - ${label} - ${level} ~ ${message}`;
    Object.entries(rest).forEach(([k, v]) => {
      str += v ? ` | ${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}` : ''
    })
    return str;
  })
);
const logger = winston.createLogger({
  level: 'silly',
  format: myFormat,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ 
      filename: `${moment().format('YYYY-MM-DD')}.info.yml`, 
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
