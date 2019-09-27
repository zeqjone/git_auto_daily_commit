/**
 * 改文件是 pm2 的配置文件，可以设置环境变量
 */
module.exports = {
  apps: [{
    name: 'release-gito',
    script: './app.js',
    env: {
      "NODE_ENV": "production"
    }
  }, {
    name: 'test-gito',
    script: './app.js',
    env: {
      "NODE_ENV": "test"
    }
  }]
}