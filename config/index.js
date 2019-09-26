module.exports = Object.assign({
}, process.env.NODE_ENV === 'production' ? require('./env/prod') : require('./env/dev'))