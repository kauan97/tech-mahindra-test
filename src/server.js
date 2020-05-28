const app = require('./app')

const port = process.env.PORT || 3000
app.listen(port)

console.log('\x1b[32m%s\x1b[0m', '[ Ok ]', `Server is running on port ${port}`)
