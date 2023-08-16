/*
7. En la carpeta middleware contiene los siguientes archivos:
- index.js módulo que exporta los middleware
*/

const verifyToken = require('./auth')
const verifySingUp = require('./verifySingUp')


// Declarar una constante validations que se inicializa como un objeto al que se le asignan las propiedades verifySingUp y verifyToken
const validations = {
    verifySingUp: verifySingUp,
    verifyToken: verifyToken
}

// Exportar validations
module.exports = validations;