const path = require('path')
const {managerPath} = require('../../config')
const shell = require('shelljs')
const fs = require('fs')

class GitVersionJob {
  constructor () {
    this.version = '';
    this.autoCommit();
  }

  gitPull()  {
    shell.cd(managerPath);
    shell.exec('git checkout dev')
    shell.exec('git pull -f origin dev:dev')
  }

  gitPush () {
    shell.exec('git add .');
    shell.exec(`git commit -m "${this.version}"`);
    shell.exec('git push origin dev:dev');
  }
  async setPackage (str) {
    let packagePath = path.resolve(managerPath, 'package.json');
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
  async getStrPackage () {
    return new Promise((resolve, reject) => {
      const ins = this;
      let packagePath = path.resolve(managerPath, 'package.json');
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
            str = str.replace(vNo, arrVno.join('.'));
            arr.splice(i, 1, str);
            ins.version = str;
            break;
          }
        }
        resolve(arr.join('\n'))
      })
      rStream.on('data', function(data) {
        console.log('data')
        fc += data;
      })
      rStream.on('error', function(err) {
        console.log('error')
        console.log(err)
        reject(err)
      })
    })
  }
  async autoCommit () {
    console.log('git pull begin')
    try {
      if (!shell.which('git')) {
        shell.echo('sorry, this script requires git')
        shell.exit(1)
      }
      console.log('git pull end')
      this.gitPull();
      let str = await this.getStrPackage();
      await this.setPackage(str);
      this.gitPush();
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = new GitVersionJob()
