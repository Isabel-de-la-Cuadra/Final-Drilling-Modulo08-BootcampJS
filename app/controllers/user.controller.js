const { users } = require('../models')
const db = require('../models')
const User = db.users
const Bootcamp = db.bootcamps

// Declaración constante bcrypt que se inicializa importando el módulo bcryptjs
const bcrypt = require('bcryptjs')
    // Declaración de constante validaciones que se inicializa importando el módulo index.js
const validaciones = require('./../middleware/index.js')
    // Declaración de constante que utiliza la desestructuración para extraer la variable PASSWORD del módulo db.config.js
const { PASSWORD } = require('../config/db.config')
    // Declaración de la constante tokenValidations que inicializa la función validateToken del módulo validaciones
const tokenValidations = validaciones.validateToken

// Crear y Guardar Usuarios
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

// obtener los bootcamp de un usuario
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

// obtener todos los Usuarios incluyendo los bootcamp
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

// Actualizar usuarios
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

// Borrar usuarios
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
    // Declarar la variable wantedUser y se utiliza para almancenar el resultado de la búsqueda de un usuario en la DDBB utilizando el método findOne de Sequelize y se busca según el email pasado por argumento
    const wantedUser = await User.findOne({ where: { email: email } })
        /*
        Aquí se realizan dos comprobaciones:
        Primero, se verifica si no se encontró ningún usuario en la base de datos con el correo electrónico proporcionado. Si es así, se lanza un error con el mensaje 'Usuario no registrado'.
        Luego, se utiliza bcrypt.compareSync para comparar la contraseña proporcionada (PASSWORD) con la contraseña almacenada en la base de datos (wantedUser.PASSWORD). Si las contraseñas no coinciden, se lanza un error con el mensaje 'Usuario y / o contraseña incorrectos'.
        */

    if (!wantedUser) {
        throw 'Usuario no registrado'
    } else if (!bcrypt.compareSync(PASSWORD, wantedUser.PASSWORD)) {
        throw 'Usuario y / o contraseña incorrectos'
    }
    /*
    const accessToken: Aquí se genera un token de acceso utilizando una función encodeToken del módulo tokenValidations. Esto indica que se está utilizando un token (posiblemente un JSON Web Token) para manejar la autenticación del usuario.
    */
    const accessToken = tokenValidations.encodeToken(wantedUser)
        /*
        const objUser: Se crea un objeto llamado objUser que contiene información del usuario, incluyendo su id, nombre, apellido, correo electrónico y el token de acceso generado.
        */
    const objUSer = {
            id: wantedUser.id,
            firstName: wantedUser.firstName,
            lastName: wantedUser.lastName,
            email: wantedUser.email,
            accessToken: accessToken
        }
        // Finalmente, la función retorna el objeto objUser, que contiene la información del usuario y el token de acceso. Presumiblemente, este objeto se utilizará para proporcionar información al usuario después de un inicio de sesión exitoso.
    return objUSer
}