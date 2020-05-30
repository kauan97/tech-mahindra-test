const request = require('supertest')
const faker = require('faker')
const { resolve } = require('path')

const db = require(resolve('src', 'database'))
const app = require(resolve('src', 'app'))
const factory = require(resolve('__tests__', 'factories'))

describe('User authentication', () => {
	beforeAll(async () => {
		await db.connect('user_authentication')
	})

	afterAll(async () => {
		await db.destroy('user_authentication')
	})

	beforeEach(async () => {
		await db.truncate('user_authentication')
	})

	describe('Sign up', () => {
		it('should be able to register a user', async () => {
			const user = {
				nome: faker.name.findName(),
				email: faker.internet.email(),
				senha: faker.internet.password(),
				telefones: [
					{
						numero: faker.phone.phoneNumberFormat(),
						ddd: faker.random.number().toString()
					}
				]
			}

			const response = await request(app)
				.post('/api/auth/register')
				.send(user)

			expect(response.status).toBe(201)
			expect(response.body).toHaveProperty('_id')
			expect(response.body).toHaveProperty('data_criacao')
			expect(response.body).toHaveProperty('data_atualizacao')
			expect(response.body).toHaveProperty('ultimo_login')
		})

		it('should return jwt token when registered', async () => {
			const user = {
				nome: faker.name.findName(),
				email: faker.internet.email(),
				senha: faker.internet.password(),
				telefones: [
					{
						numero: faker.phone.phoneNumberFormat(),
						ddd: faker.random.number().toString()
					}
				]
			}

			const response = await request(app)
				.post('/api/auth/register')
				.send(user)

			expect(response.status).toBe(201)
		})

		it('should not be able to allow user registration when an email already exists', async () => {
			const { nome, email, senha, telefones } = await factory.create('User')
			const user = {
				nome,
				email,
				senha,
				telefones
			}

			const response = await request(app)
				.post('/api/auth/register')
				.send(user)

			expect(response.status).toBe(400)
			expect(response.body.mensagem).toBe('E-mail já existente.')
		})

		it('should not be able to allow user registration passing an invalid email', async () => {
			const user = {
				nome: faker.name.findName(),
				email: 'invalid@email',
				senha: faker.internet.password(),
				telefones: [
					{
						numero: faker.phone.phoneNumberFormat(),
						ddd: faker.random.number().toString()
					}
				]
			}

			const response = await request(app)
				.post('/api/auth/register')
				.send(user)

			expect(response.status).toBe(400)
			expect(response.body.message).toBe('"email" must be a valid email')
		})
	})

	describe('Sign in', () => {
		it('should authenticate with valid credentials', async () => {
			const senha = '123123'

			const user = await factory.create('User', {
				senha
			})

			const response = await request(app)
				.post('/api/auth/login')
				.send({
					email: user.email,
					senha
				})

			expect(response.status).toBe(200)
		})

		it('should return jwt token when authenticated', async () => {
			const senha = '123123'

			const user = await factory.create('User', {
				senha
			})

			const response = await request(app)
				.post('/api/auth/login')
				.send({
					email: user.email,
					senha
				})

			expect(response.body).toHaveProperty('token')
		})

		it('should not authenticate with nonexistent email', async () => {
			const response = await request(app)
				.post('/api/auth/login')
				.send({
					email: 'nonexistent@email.com',
					senha: '123456'
				})

			expect(response.status).toBe(401)
			expect(response.body.mensagem).toBe('Usuário e/ou senha inválidos')
		})

		it('should not authenticate with invalid password', async () => {
			const user = await factory.create('User', {
				senha: '123123'
			})

			const response = await request(app)
				.post('/api/auth/login')
				.send({
					email: user.email,
					senha: '123456'
				})

			expect(response.status).toBe(401)
			expect(response.body.mensagem).toBe('Usuário e/ou senha inválidos')
		})

		it('should not authenticate with an invalid email', async () => {
			const response = await request(app)
				.post('/api/auth/login')
				.send({
					email: 'invalid@email',
					senha: '123456'
				})

			expect(response.status).toBe(400)
			expect(response.body.message).toBe('"email" must be a valid email')
		})
	})
})
