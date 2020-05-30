const bcrypt = require('bcryptjs')

const UserModel = require('../models/UserModel')
const { generateToken } = require('../services/user')

class AuthController {
	constructor (_req, _res) {
		this.req = _req
		this.res = _res
	}

	async register () {
		const { email } = this.req.body

		try {
			const userAlreadyExists = await UserModel.findOne({ email })
			if (userAlreadyExists) {
				return this.res.error('E-mail já existente.', 400)
			}

			const user = new UserModel({})
			const fieldsNotCreated = this.getFieldsNotCreated()

			Object.keys(this.req.body)
				.forEach(key => {
					if (!fieldsNotCreated.includes(key)) {
						user[key] = this.req.body[key]
					}
				})

			user.token = generateToken({ userId: user._id })
			await user.save()

			user.senha = undefined

			return this.res.success(user, 201)
		} catch (err) {
			return this.res.error('Não foi possível cadastrar o usuário. Tente novamente mais tarde.', 500)
		}
	}

	async login () {
		const { email, senha } = this.req.body

		try {
			const user = await UserModel.findOne({ email }).select('+senha')
			if (!user) {
				return this.res.error('Usuário e/ou senha inválidos', 401)
			}

			if (!await bcrypt.compare(senha, user.senha)) {
				return this.res.error('Usuário e/ou senha inválidos', 401)
			}

			user.token = generateToken({ userId: user._id })

			const currentDate = new Date()

			user.ultimo_login = currentDate
			user.data_atualizacao = currentDate
			user.senha = senha

			await user.save()

			user.senha = undefined
			return this.res.success(user, 200)
		} catch (err) {
			return this.res.error('Não foi possível autenticar o usuário. Tente novamente mais tarde', 500)
		}
	}

	getFieldsNotCreated () {
		return ['_id', '__v', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']
	}
}

module.exports = AuthController
