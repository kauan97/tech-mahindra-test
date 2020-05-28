
// const { celebrate, Joi, Segments, errors } = require('celebrate')
const { errors } = require('celebrate')

// const UserController = require('../app/controllers/UserController')
const tokenValidatorMiddleware = require('../app/middlewares/tokenValidatorMiddleware')

module.exports = app => {
	app.get('/api', (req, res) => {
		res.status(200).send({ message: 'Welcome to Tech Mahindra API!' })
	})

	app.use(tokenValidatorMiddleware)

	// Pretty validation errors
	app.use(errors())
}
