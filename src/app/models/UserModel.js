const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
	nome: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	senha: {
		type: String,
		required: true,
		select: false
	},
	telefones: [{
		numero: {
			type: String,
			require: true
		},
		ddd: {
			type: String,
			require: true
		}
	}],
	data_criacao: {
		type: Date,
		default: Date.now
	},
	data_atualizacao: {
		type: Date,
		default: Date.now
	},
	ultimo_login: {
		type: Date,
		default: Date.now
	},
	token: {
		type: String
	}
})

UserSchema.pre('save', async function (next) {
	if (this.senha) {
		this.senha = await bcrypt.hash(this.senha, 10)
	}
	next()
})

module.exports = mongoose.model('User', UserSchema)
