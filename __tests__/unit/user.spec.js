const bcrypt = require('bcryptjs')
const path = require('path')

const factory = require(path.resolve('__tests__', 'factories'))
const db = require(path.resolve('src', 'database'))

describe('User', () => {
	beforeAll(async () => {
		await db.connect('encrypt_password')
	})

	afterAll(async () => {
		await db.destroy()
	})

	beforeEach(async () => {
		await db.truncate()
	})

	it('should encrypt user password', async () => {
		const senha = '123456'
		const user = await factory.create('User', {
			senha
		})

		const compareHash = await bcrypt.compare(senha, user.senha)

		expect(compareHash).toBe(true)
	})
})
