const UserModel = require('../models/UserModel')

const { generateToken } = require('../services/user')

class AuthController {
    constructor (_req, _res) {
        this.req = _req
        this.res = _res
    }

    async register () {
        try {
            const { email } = this.req.body

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
            return this.res.error('Não foi possível cadastrar o usuário, tente novamente mais tarde.', 400)
        }
	}

	getFieldsNotCreated () {
		return ['_id', '__v', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']
	}
}

module.exports = AuthController
