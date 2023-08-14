/*
6. En la carpeta controllers posee los controladores tanto para el usuario (user.controller.js) como para el bootcamp
Para el usuario se deben adecuar los siguientes controladores para la API:
- Crear y guardar usuarios llamado createUser
- Obtener los bootcamp de un usuario llamado findUserById
- Obtener todos los usuario incluyendo los bootcamp llamado findAll
- Actualizar usuario por Id llamado updateUserById
- Eliminar un usuario por Id llamdo deleteUserById
*/

const { users } = require('../models')
const db = require('../models')
const User = db.users
const Bootcamp = db.bootcamps

// Declaración constante bcrypt que se inicializa importando el módulo bcryptjs
const bcrypt = require('bcryptjs')
    // Declaración de constante validaciones que se inicializa importando el módulo index.js
const validations = require('./../middleware/index.js')
    // Declaración de constante que utiliza la desestructuración para extraer la variable PASSWORD del módulo db.config.js
const { PASSWORD } = require('../config/db.config')
    // Declaración de la constante tokenValidations que inicializa la función validateToken del módulo validaciones
const tokenValidations = validations.validateToken

// Crear y Guardar Usuarios | Proporcionado primer Sprint (- PASSWORD que se incluye ahora)
exports.createUser = (user) => {
    return User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            PASSWORD: bcrypt.hashSync(user.PASSWORD, 10)
        })
        .then(user => {
            console.log(`>> Se ha creado el usuario: ${JSON.stringify(user, null, 4)}`)
            return user
        })
        .catch(err => {
            console.log(`>> Error al crear el usuario ${err}`)
        })
}

// obtener los bootcamp de un usuario | Proporcionado primer Sprint
exports.findUserById = (userId) => {
    return User.findByPk(userId, {
            include: [{
                model: Bootcamp,
                as: "bootcamps",
                attributes: ["id", "title"],
                through: {
                    attributes: [],
                }
            }, ],
        })
        .then(users => {
            return users
        })
        .catch(err => {
            console.log(`>> Error mientras se encontraba los usuarios: ${err}`)
        })
}

// obtener todos los Usuarios incluyendo los bootcamp | Proporcionado primer Sprint
exports.findAll = () => {
    return User.findAll({
        include: [{
            model: Bootcamp,
            as: "bootcamps",
            attributes: ["id", "title"],
            through: {
                attributes: [],
            }
        }, ],
    }).then(users => {
        return users
    })
}

// Actualizar usuarios | Proporcionado primer Sprint
exports.updateUserById = (userId, fName, lName) => {
    return User.update({
            firstName: fName,
            lastName: lName
        }, {
            where: {
                id: userId
            }
        })
        .then(user => {
            console.log(`>> Se ha actualizado el usuario: ${JSON.stringify(user, null, 4)}`)
            return user
        })
        .catch(err => {
            console.log(`>> Error mientras se actualizaba el usuario: ${err}`)
        })
}

// Borrar usuarios | Proporcionado primer Sprint
exports.deleteUserById = (userId) => {
    return User.destroy({
            where: {
                id: userId
            }
        })
        .then(user => {
            console.log(`>> Se ha eliminado el usuario: ${JSON.stringify(user, null, 4)}`)
            return user
        })
        .catch(err => {
            console.log(`>> Error mientras se eliminaba el usuario: ${err}`)
        })
}

// Ruta Login. Función que maneja la lógica de inicio de sesión de usuario
// Exportar la función loginUser
exports.loginUser = async(userData) => {
    // crear una constante destructurando las propiedades email y PASSWORD del objeto userData
    const { email, PASSWORD } = userData
    /* Declarar la variable wantedUser y se utiliza para almancenar el resultado de la búsqueda de un usuario en la DDBB 
    utilizando el método findOne de Sequelize y se busca según el email pasado por argumento
    */
    const wantedUser = await User.findOne({ where: { email: email } })
        /*
        En este if se realizan dos comprobaciones:
        1. Se verifica si no se encontró ningún usuario en la base de datos con el correo electrónico proporcionado. 
        Si es así, se lanza un error con el mensaje 'Usuario no registrado'.
        2. Se utiliza bcrypt.compareSync para comparar la contraseña proporcionada (PASSWORD) con la contraseña almacenada 
        en la base de datos (wantedUser.PASSWORD). Si las contraseñas no coinciden, se lanza un error con el mensaje 
        'Usuario y / o contraseña incorrectos'.
        */
    if (!wantedUser) {
        throw 'Usuario no registrado'
    } else if (!bcrypt.compareSync(PASSWORD, wantedUser.PASSWORD)) {
        throw 'Usuario y / o contraseña incorrectos'
    }
    /*
    Se genera un token de acceso utilizando una función encodeToken del módulo tokenValidations. 
    Esto indica que se está utilizando un token (posiblemente un JSON Web Token) para manejar la autenticación del usuario.
    */
    const accessToken = tokenValidations.encodeToken(wantedUser)
        /*
        Acá se crea un objeto llamado objUser que contiene información del usuario, incluyendo su id, nombre, apellido, 
        correo electrónico y el token de acceso generado.
        */
    const objUSer = {
            id: wantedUser.id,
            firstName: wantedUser.firstName,
            lastName: wantedUser.lastName,
            email: wantedUser.email,
            accessToken: accessToken
        }
        // Se retorna el objeto objUser, que contiene la información del usuario y el token de acceso. 
    return objUSer
}