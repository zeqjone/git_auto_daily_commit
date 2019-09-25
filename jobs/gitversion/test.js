const m = require('./index')
console.log('process begin')
try {
  m.autoCommit()
  .then(() => console.log('enddd'))
  .catch(err => console.error(err));
  console.log('process end')
}
catch (err) {
  console.error(err)
}