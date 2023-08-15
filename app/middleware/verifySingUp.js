/*
7. En la carpeta middleware contiene los siguientes archivos:
- verifySingUp.js que verifica si el correo ya se encuentra ingresado al momento de registrarse un nuevo usuario
*/

// Declarar una constante db que importa el módulo models 
const db = require('../models')

// Declarar una constante User que accede a la propiedad users del objeto db
const User = db.users

// Exportar la función validateEmail que recibe la dirección de correo electrónico email como argumento
exports.verifySingUp = (email) => {
    // Declarar la constante wantedEmail donde se utiliza el métod findOne del modelo User, donde se busca la coincidencia del valor email pasado por parámetro y el de la db
    const wantedEmail = User.findOne({ where: { email: email } })

    // Se retorna el resultado de la búsqueda, puede ser que se cumple la condición o null, si no se encuentra 
    return wantedEmail
}