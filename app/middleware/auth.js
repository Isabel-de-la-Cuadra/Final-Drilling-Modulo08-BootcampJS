const secretKey = require('./../config/auth.config')
const jwt = require('node.jwt')

exports.encodeToken = (data) => {
    const token = jwt.encode(data, secretKey)
    return token
}
exports.decodeToken = (data) => {
    const token = jwt.decode(data, secretKey)
    return token
}