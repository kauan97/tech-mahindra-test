const request = require('supertest')

const db = require('../../src/database')
const app = require('../../src/app')
const factory = require("../factories")

describe('User authentication', () => {
    beforeAll(async () => {
        await db.connect()
    })

    afterAll(async () => {
        await db.destroy()
    })

    beforeEach(async () => {
        await db.truncate()
	})

	describe('Sign up', () => {
		it('should be able to register a user', async () => {
			const { nome, email, senha, telefones } = await factory.create('User')
			const user = {
				nome,
				email: 'orlandokauan.barros@gmail.com',
				senha,
				telefones
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
	})

	describe('Sign in', () => {
		it('should authenticate the user with valid credentials', async () => {
			const senha = '123123'

			const user = await factory.create("User", {
				senha
			})

			const response = await request(app)
				.post('/api/auth/authenticate')
				.send({
					email: user.email,
					senha
				})

			expect(response.status).toBe(200)
			expect(response.body).toHaveProperty('token')
		})
	})
})
