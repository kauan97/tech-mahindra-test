const { NODE_ENV } = process.env

require('dotenv').config({
	path: (NODE_ENV === 'test' ? '.env.test' : '.env')
})

const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const RateLimit = require('express-rate-limit')

const responseMiddleware = require('./app/middlewares/responseMiddleware')
const database = require('./database')

class App {
	constructor () {
		this.express = express()

		if (NODE_ENV !== 'test') {
			database.connect().then(() => {
				console.log('\x1b[32m%s\x1b[0m', '[ Ok ]', `mongodb has been connected: ${NODE_ENV}`)
			}).catch(err => {
				console.log('\x1b[31m%s\x1b[0m', '[ Er ]', `mongodb was not connected: ${NODE_ENV}`)
				console.log(err)
				process.exit(1)
			})
		}

		this.setMiddlewares()
		this.setRoutes()
	}

	setMiddlewares () {
		this.express.use(cors({ origin: true, credentials: true }))

		// security middlewares
		this.express.use(new RateLimit({
			windowMs: 60000,
			max: 15,
			delayMs: 0,
			message: 'You exceeded the request limit rate. Wait 1 minute to re-order.',
			skipFailedRequests: true,
			skip: req => req.method === 'GET'
		}))

		// express middlewares
		this.express.use(express.json())
		this.express.use(express.urlencoded({ extended: false }))

		this.express.use(responseMiddleware)
		this.express.use(logger('dev'))
	}

	setRoutes () {
		require('./routes')(this.express)
	}
}

module.exports = new App().express
