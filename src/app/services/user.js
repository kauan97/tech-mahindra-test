const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: params => (
        jwt.sign({ params }, process.env.APP_SECRET, { expiresIn: '1h' })
    )
}