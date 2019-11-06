# 代码自动提交版本的任务

如果项目的代码是 daily build的，第二天马上测试前一天的改动；为了在界面上能够看到版本号的改动， 需要每天提交一个小版本号。这样一个小任务每天手动更新很麻烦。那这个项目就是每个工作日的晚上11：30自动的将 manager 的 package.json 的版本号 +1， 并且在 git 上提交一个 commit

### 业务

* 晚上11点30开始做任务
  + 更新 仓库 的代码
  + 修改 package.json，小版本号 +1，保存；
  + 提交上面的更新，注释为 version: x.y.z;

* 周 1，2，3，4，5 做任务

### todos

- [x] package.json 和 ui/package.json 的 version 不一致
- [ ] 支持配置 git GPG key 对 git repo 操作
- [ ] 支持配置本地路径