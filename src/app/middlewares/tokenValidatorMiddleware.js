const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	const authHeader = req.headers.authorization
	if (!authHeader) {
		return res.status(401).send({ mensagem: 'Não autorizado.' })
	}

	const parts = authHeader.split(' ')
	if (parts.length !== 2) {
		return res.status(401).send({ mensagem: "O token deve conter 'Bearer' + hash." })
	}

	const [scheme, token] = parts
	if (!/^Bearer$/i.test(scheme)) {
		return res.status(401).send({ mensagem: 'Token mal formatado.' })
	}

	jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).send({ mensagem: 'Token inválido.' })
		}

		req.user = decoded.params

		return next()
	})
}
