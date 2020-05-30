const UserModel = require('../models/UserModel')

class UserController {
	constructor (_req, _res) {
		this.req = _req
		this.res = _res
	}

	async getUser () {
		const { _id } = this.req.params
		const [, token] = this.req.headers.authorization.split(' ')

		try {
			/* Suggestion
			Here we could validate if the user's id that was inside the
			token is similar to the one passed in the path, so we wouldn't
			need to store the user's token in the database.

			But to stay aligned with what was asked in the test,
			I will follow the business rules informed ;)

			console.log(this.req.user) <- user's id that was inside the token.
			*/

			const user = await UserModel.findById(_id).lean()

			if (!user) {
				return this.res.error('Usuário não encontrado.', 400)
			}

			if (user.token !== token) {
				return this.res.error('Não autorizado.', 403)
			}

			if (!this.checkUserSession(user.ultimo_login)) {
				return this.res.error('Sessão expirada.', 403)
			}

			return this.res.success(user, 200)
		} catch (err) {
			console.log(err)
			return this.res.error('Não foi possível buscar o usuário. Tente novamente mais tarde.', 500)
		}
	}

	checkUserSession (lastLogin) {
		const now = new Date()
		const diffMillis = (now - lastLogin)
		const minutes = (diffMillis / 1000) / 60

		if (minutes >= 30) return
		return true
	}
}

module.exports = UserController
