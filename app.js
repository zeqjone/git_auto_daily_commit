const schedule = require('node-schedule')
const moment = require('moment')
const gitVersionJob = require('./jobs/gitversion')

let job = schedule.scheduleJob('30 23 * * 1-5', function () {
  console.log('git version commit start');
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
  gitVersionJob.autoCommit()
})
