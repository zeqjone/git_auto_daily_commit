const logger = require('../lib/logger')

logger.info('NODE_ENV', {NODE_ENV: process.env.NODE_ENV})
console.error(process.env.NODE_ENV)
module.exports = Object.assign({
}, process.env.NODE_ENV === 'production' ? require('./env/prod') : require('./env/dev'))