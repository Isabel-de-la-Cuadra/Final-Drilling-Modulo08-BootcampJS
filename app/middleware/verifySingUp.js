/*
7. En la carpeta middleware contiene los siguientes archivos:
- verifySingUp.js que verifica si el correo ya se encuentra ingresado al momento de registrarse un nuevo usuario
*/

// Declarar una constante db que importa el módulo models 
const db = require('../models')

// Declarar una constante User que accede a la propiedad users del objeto db
const User = db.users

// Crear la función verifySingUp que recibe la dirección de correo electrónico email como argumento
const verifySingUp = async(email) => {
    try {
        // Busca un usuario en la base de datos con el correo electrónico proporcionado
        const existingEmail = await User.findOne({ where: { email } });

        // Retorna true si el usuario con el correo electrónico ya existe, y false si no existe
        return !!existingEmail;
    } catch (error) {
        // Si ocurre un error en la consulta a la base de datos, lanza una excepción
        throw error;
    }
}

// Exportar la función middleware verifySingUp para su uso en otras partes del proyecto
module.exports = verifySingUp;