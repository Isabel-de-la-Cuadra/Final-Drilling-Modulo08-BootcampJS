/*
7. En la carpeta middleware contiene los siguientes archivos:
- auth.js que contiene una función de verificar token llamada verifyToken
*/

const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/auth.config');

const verifyToken = (request, response, next) => {
    const token = request.headers.authorization;

    if (!token) {
        return response.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            return response.status(403).json({ success: false, message: 'Token inválido' });
        }
        request.userId = decoded.userId;
        next();
    });
};

module.exports = verifyToken;




/*
// Declarar una constante jwt que se importa del módulo jsonwebtoken
const jwt = require('jsonwebtoken')

// Declarar una constante secretKey que importa el contenido del módulo auth.config.js
const secretKey = require('./../config/auth.config')

const verifyToken = (request, response, next) => {
    const token = request.headers.authotization
    const dataUSer = jwt.decode(token, secretKey)

    if (dataUSer.code !== '000') {
        return response.status(403).json({ success: false, message: 'Token inválido' })
    }

    request.connected = dataUSer.payload
    next()
}

module.exports = verifyToken

*/