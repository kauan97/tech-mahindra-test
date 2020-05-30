const request = require('supertest')
const { resolve } = require('path')

const db = require(resolve('src', 'database'))
const app = require(resolve('src', 'app'))
const factory = require(resolve('__tests__', 'factories'))
const { generateToken } = require(resolve('src', 'app', 'services', 'user'))

describe('Get user', () => {
	beforeAll(async () => {
		await db.connect('list_user')
	})

	afterAll(async () => {
		await db.destroy()
	})

	beforeEach(async () => {
		await db.truncate()
	})

	it('should list the user when passing valid token and id', async () => {
		const user = await factory.create('User')

		user.token = generateToken({ userId: user._id })

		await user.save()

		const response = await request(app)
			.get(`/api/users/${user._id}`)
			.set('Authorization', `Bearer ${user.token}`)

		expect(response.status).toBe(200)
	})

	it('should not list the user when not passing the token', async () => {
		const user = await factory.create('User')

		user.token = generateToken({ userId: user._id })

		await user.save()

		const response = await request(app)
			.get(`/api/users/${user._id}`)

		expect(response.status).toBe(401)
		expect(response.body.mensagem).toBe('Não autorizado.')
	})

	it('should not list the user if the user does not exist', async () => {
		const user = await factory.create('User')

		user.token = generateToken({ userId: user._id })

		const response = await request(app)
			.get('/api/users/5ed19a35ed39943aa4c42102')
			.set('Authorization', `Bearer ${user.token}`)

		expect(response.status).toBe(400)
		expect(response.body.mensagem).toBe('Usuário não encontrado.')
	})

	it('should not list the user if the session is expired', async () => {
		const user = await factory.create('User')

		user.token = generateToken({ userId: user._id })

		// Passing an old date
		user.ultimo_login = new Date('2020-05-28')
		await user.save()

		const response = await request(app)
			.get(`/api/users/${user._id}`)
			.set('Authorization', `Bearer ${user.token}`)

		expect(response.status).toBe(403)
		expect(response.body.mensagem).toBe('Sessão expirada.')
	})
})
