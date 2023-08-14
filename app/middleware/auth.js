/*
7. En la carpeta middleware contiene los siguientes archivos:
- auth.js que contiene una función de verificar token llamada verifyToken
OBSERVACIÓN: preferí hacer dos fuciones que codifiquen y decodifiquen token para retornar el token y que pudiera ser
usado en las otras partes del proyecto
*/

// Declarar una constante secretKey que importa el contenido del módulo auth.config.js
const secretKey = require('./../config/auth.config')
    // Declarar una constante jwt que se importa del módulo node.jwt
const jwt = require('node.jwt')

/* Exportar la función encodeToken que recibe el objeto data como argumento. 
Para codificar el objeto data en un token jwt utilizando la secretKey.
Retornar el token
*/
exports.encodeToken = (data) => {
    const token = jwt.encode(data, secretKey)
    return token
}

/* Exportar la función decodeToken que recibe el objeto data como argumento. 
Para decodificar el objeto data en un token jwt utilizando la secretKey.
Retornar el token decodificado
*/
exports.decodeToken = (data) => {
    const token = jwt.decode(data, secretKey)
    return token
}