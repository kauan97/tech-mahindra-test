
const { celebrate, Joi, Segments, errors } = require('celebrate')

const AuthController = require('../app/controllers/AuthController')
const UserController = require('../app/controllers/UserController')
const tokenValidatorMiddleware = require('../app/middlewares/tokenValidatorMiddleware')

module.exports = app => {
	app.get('/api', (req, res) => {
		res.status(200).send({ message: 'Welcome to Tech Mahindra API!' })
	})

	app.post('/api/auth/register', celebrate({
		[Segments.BODY]: Joi.object().keys({
			nome: Joi.string().required(),
			email: Joi.string().email().required(),
			senha: Joi.string().required()
		}).unknown()
	}),
	async (req, res) => (new AuthController(req, res)).register())

	app.post('/api/auth/login', celebrate({
		[Segments.BODY]: Joi.object().keys({
			email: Joi.string().email().required(),
			senha: Joi.string().required()
		})
	}),
	async (req, res) => (new AuthController(req, res)).login())

	app.get('/api/users/:_id', celebrate({
		[Segments.PARAMS]: Joi.object().keys({
			_id: Joi.string().required().length(24)
		})
	}),
	tokenValidatorMiddleware,
	async (req, res) => (new UserController(req, res)).getUser())

	// Pretty validation errors
	app.use(errors())

	// Handling not found routes
	app.use((req, res, next) => {
		const errorMessage = 'Oops! Página não encontrada.'

		if (req.accepts('json')) {
			res.status(404).send({ mensagem: errorMessage })
			return
		}
		res.status(404).type('txt').send(errorMessage)
	})
}
