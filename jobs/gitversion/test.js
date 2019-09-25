const m = require('./index')
console.log('process begin')

m.mkVersionChange()
.then(() => console.log('enddd'))
.catch(err => console.error(err));
console.log('process end')
