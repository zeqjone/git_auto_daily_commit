const m = require('./index')
console.log('process begin')

m.mkVersionChange()
.then(data => console.log('enddd', data))
.catch(err => console.error(err));
console.log('process end')
