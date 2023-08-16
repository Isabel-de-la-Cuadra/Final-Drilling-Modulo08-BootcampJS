/*
7. En la carpeta middleware contiene los siguientes archivos:
- auth.js que contiene una función de verificar token llamada verifyToken
*/

// Declarar una constante que importa el módulo jsonwebtoken
const jwt = require('jsonwebtoken');

// Importar la clave secreta desde el archivo auth.config
const { secretKey } = require('../config/auth.config');

// Definir la función middleware verifyToken
const verifyToken = (request, response, next) => {

    // Obtener el token de la cabecera authorization de la solicitud
    const token = request.headers.authorization;

    // Verificar si el token no viene
    if (!token) {

        // Retornar una respuesta 401
        return response.status(401).json({ success: false, message: 'Token no proporcionado' });
    }

    // Verificar el token utilizando jwt.verify
    jwt.verify(token, secretKey, (error, decoded) => {

        // Si hay un error en la verificación del token, retornar con error 403
        if (error) {
            return response.status(403).json({ success: false, message: 'Token inválido' });
        }
        // Si la verificación del token es exitosa, de decodifica y se agrega al userId de la solicitud
        request.userId = decoded.userId;
        // Llamar a next() para pasar a la siguiente ruta o middleware
        next();
    });
};

// Exportar la función middleware verifyToken para su uso en otras partes del proyecto
module.exports = verifyToken;