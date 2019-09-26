const path = require('path')
const {managerPath} = require('../../config')
const shell = require('shelljs')
const fs = require('fs')
const logger = require('../../lib/logger')

class GitVersionJob {
  constructor () {
    this.version = '';
  }

  gitPull()  {
    logger.info('job gitVersion task 1: git pull begin')
    shell.cd(managerPath);
    shell.exec('git checkout dev')
    shell.exec('git pull -f origin dev:dev')
    logger.info('job gitVersion task 1: git pull end')
  }

  gitPush () {
    logger.info('job gitVersion task 3: {{');
    shell.exec('git add .');
    shell.exec(`git commit -m "${this.version}"`);
    shell.exec('git push origin dev:dev');
    logger.info('job gitVersion task 3: }}');
  }
  async makeVersionChange () {
    logger.info('job gitVersion task 2: {{')
    let packagePath = path.resolve(managerPath, 'package.json');
    let str = await this.getStrPackage(packagePath);
    await this.setPackage(packagePath, str);
    let packagePath2 = path.resolve(managerPath, 'ui', 'package.json');
    str = await this.getStrPackage(packagePath2);
    await this.setPackage(packagePath2, str);
    logger.info('job gitVersion task 2: }}')
  }
  async setPackage (packagePath, str) {
    let wStream = fs.createWriteStream(packagePath, {flags: 'r+'});
    wStream.write(str, function (err) {
      if (err) {
        console.error('write err', err);
      }
    })
    wStream.on('close', () => {
      console.info('write stream close')
    })
    wStream.on('error', (err) => {
      console.error('write stream error', err)
    })
  }
  async getStrPackage (packagePath) {
    return new Promise((resolve, reject) => {
      const ins = this;
      let rStream = fs.createReadStream(packagePath, {flags: 'r+'});
      let fc = '';
      rStream.on('end', function() {
        let arr = fc.split(/\n/g);
        for(let i in arr) {
          let str = arr[i];
          if (/"version":/.test(str)) {
            let vNo = str.replace(/.*(\d+\.\d+\.\d+).*/, '$1')
            let arrVno = vNo.split('.');
            let lastNoPlus = parseInt(arrVno.pop()) + 1;
            arrVno.push(lastNoPlus);
            let strVno = arrVno.join('.');
            str = str.replace(vNo, strVno);
            logger.info('job gitVersion new version number', {strVno});
            arr.splice(i, 1, str);
            ins.version = strVno;
            break;
          }
        }
        resolve(arr.join('\n'))
      })
      rStream.on('data', function(data) {
        fc += data;
      })
      rStream.on('error', function(err) {
        logger.error('job gitVersion rStream', err)
        reject(err)
      })
    })
  }
  async autoCommit () {
    logger.info('job gitVersion task begin')
    try {
      if (!shell.which('git')) {
        shell.echo('sorry, this script requires git')
        shell.exit(1)
      }
      this.gitPull();
      await this.makeVersionChange();
      this.gitPush();
      logger.info('job gitVersion task success')
    } catch (err) {
      logger.info('job gitVersion task error')
      logger.error('job gitVersion main', err)
    }
  }
}

module.exports = new GitVersionJob()
