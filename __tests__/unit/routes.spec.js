const request = require('supertest')
const path = require('path')

const app = require(path.resolve('src', 'app'))

describe('Routes', () => {
	it('should return an error message in JSON when the route is not found', async () => {
		const response = await request(app)
			.get('/not-found-page')

		expect(response.status).toBe(404)
		expect(response.body).toHaveProperty('mensagem')
		expect(response.header['content-type']).toBe('application/json; charset=utf-8')
	})
})
