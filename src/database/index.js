require('dotenv').config({
	path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const mongoose = require('mongoose')

module.exports = {
	async connect (dbName) {
		await mongoose.connect(`${process.env.MONGO_URL}${dbName}`, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true
		})

		return mongoose.connection
	},
	async destroy () {
		await mongoose.connection.close()
	},
	async truncate () {
		await mongoose.connection.db.dropDatabase()
	}
}
