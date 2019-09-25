const path = require('path')
const {managerPath} = require('../../config')
const shell = require('shelljs')
const fs = require('fs')

const gitPull = () => {
  shell.cd(managerPath);
  shell.exit('git checkout dev')
  shell.exec('git pull -f origin dev:dev')
}

const setPackage = async (str) => {
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

const getStrPackage = async () => {
  return new Promise((resolve, reject) => {
    let packagePath = path.resolve(managerPath, 'package.json');
    let rStream = fs.createReadStream(packagePath, {flags: 'r+'});
    let fc = '';
    rStream.on('end', function() {
      let arr = fc.split(/\n/g);
      for(let i in arr) {
        let str = arr[i];
        if (/"version":/.test(str)) {
          let vNo = str.replace(/.*(v\d+\.\d+\.\d+).*/, '$1')
          let arrVno = vNo.split('.');
          let lastNoPlus = parseInt(arrVno.pop()) + 1;
          arrVno.push(lastNoPlus);
          str = str.replace(vNo, arrVno.join('.'));
          arr.splice(i, 1, str);
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

module.exports = {
  autoCommit () {
    if (!shell.which('git')) {
      shell.echo('sorry, this script requires git')
      shell.exit(1)
    }
    gitPull();
    arrVersion.push(lastVersion);
    let packageFile = fs.readFileSync(package);
  },
  async mkVersionChange() {
    let str = await getStrPackage();
    await setPackage(str)
  }
}
