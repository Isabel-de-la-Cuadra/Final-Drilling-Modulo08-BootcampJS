/*
7. En la carpeta middleware contiene los siguientes archivos:
- index.js módulo que exporta los middleware
*/

// Declarar una constante validations que se inicializa como un objeto al que se le asignan las propiedades validateEmail y validateToken
const validations = {
    validateEmail: require('./verifySingUp'),
    validateToken: require('./auth')
}

// Exportar validations
module.exports = validations