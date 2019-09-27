/**
 * 改文件是 pm2 的配置文件，可以设置环境变量
 */
module.exports = {
  apps: [{
    name: 'release-implant',
    script: './app.js',
    env: {
      "NODE_ENV": "production"
    }
  }, {
    name: 'test-implant',
    script: './app.js',
    env: {
      "NODE_ENV": "test"
    }
  }]
}