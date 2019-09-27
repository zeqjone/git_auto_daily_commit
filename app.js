const schedule = require('node-schedule')
const moment = require('moment')
const gitVersionJob = require('./jobs/gitversion')
const logger = require('./lib/logger')

let job = schedule.scheduleJob('*/2 * * * 1-5', function () {
// let job = schedule.scheduleJob('*/2 * * * 1-5', function () {
  logger.info(`git version commit start: ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
  gitVersionJob.autoCommit()
})
