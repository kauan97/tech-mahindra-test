const faker = require('faker')
const { factory } = require('factory-girl')
const User = require('../src/app/models/UserModel')

factory.define('User', User, {
    nome: faker.name.findName(),
	email: faker.internet.email(),
	senha: faker.internet.password(),
	telefones: [
		{
			numero: faker.phone.phoneNumberFormat(),
			ddd: faker.random.number().toString()
		}
	]
})

module.exports = factory
