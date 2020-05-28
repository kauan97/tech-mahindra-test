
const { celebrate, Joi, Segments, errors } = require('celebrate')
// const { errors } = require('celebrate')

const AuthController = require('../app/controllers/AuthController')
const tokenValidatorMiddleware = require('../app/middlewares/tokenValidatorMiddleware')

module.exports = app => {
	app.get('/api', (req, res) => {
		res.status(200).send({ message: 'Welcome to Tech Mahindra API!' })
	})

	app.post('/api/auth/register', celebrate({
			[Segments.BODY]: Joi.object().keys({
				nome: Joi.string().required(),
				email: Joi.string().required(),
				senha: Joi.string().required()
			}).unknown(),
		}),
		async (req, res) => (new AuthController(req, res)).register()
	)

	// app.use(tokenValidatorMiddleware)

	// Pretty validation errors
	app.use(errors())
}
