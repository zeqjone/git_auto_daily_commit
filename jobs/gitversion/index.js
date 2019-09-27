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
    let str2 = await this.getStrPackage(packagePath2);
    await this.setPackage(packagePath2, str2);
    logger.info('job gitVersion task 2: }}')
  }
  async setPackage (packagePath, str) {
    let wStream = fs.createWriteStream(packagePath, {flags: 'r+'});
    wStream.write(str, function (err) {
      if (err) {
        logger.error('write err', err);
      }
      wStream.close();
    })
    wStream.on('close', () => {
    })
    wStream.on('error', (err) => {
      logger.error('write stream error', err)
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
            if (ins.version) {
              str = str.replace(vNo, ins.version)
            } else {
              let arrVno = vNo.split('.');
              let lastNoPlus = parseInt(arrVno.pop()) + 1;
              arrVno.push(lastNoPlus);
              let strVno = arrVno.join('.');
              str = str.replace(vNo, strVno);
              logger.info('job gitVersion new version number', {strVno});
              ins.version = strVno;
            }
            arr.splice(i, 1, str);
            break;
          }
        }
        resolve(arr.join('\n'))
        rStream.close();
      })
      rStream.on('data', function(data) {
        logger.debug('read stream data')
        fc += data;
      })
      rStream.on('close', function () {
        logger.debug('rstream close')
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
      this.version = '';
      if (!shell.which('git')) {
        shell.echo('sorry, this script requires git')
        shell.exit(1)
      }
      this.gitPull();
      await this.makeVersionChange();
      this.gitPush();
      logger.info('job gitVersion task success')
    } catch (err) {
      logger.error('job gitVersion main', err)
    }
  }
}

module.exports = new GitVersionJob()
