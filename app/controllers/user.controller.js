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

// Declarar una constante que importa el módulo jsonwebtoken
const jwt = require('jsonwebtoken');

// Importar la clave secreta desde el archivo auth.config
const { secretKey } = require('../config/auth.config');


// Crear y Guardar Usuarios | Proporcionado primer Sprint (- PASSWORD que se incluye ahora)
exports.createUser = (user) => {
    return User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            // Creación de un password encriptado por bcrypt.hashSync
            password: bcrypt.hashSync(user.password, 10)
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

    // crear una constante destructurando las propiedades email y password del objeto userData
    const { email, password } = userData;

    /* Declarar la variable wantedUser y se utiliza para almancenar el resultado de la búsqueda de un usuario en la DDBB 
    utilizando el método findOne de Sequelize y se busca según el email pasado por argumento
    */
    const wantedUser = await User.findOne({ where: { email: email } });

    /*
    En este if se realizan dos comprobaciones:
    1. Se verifica si no se encontró ningún usuario en la base de datos con el correo electrónico proporcionado. 
    Si es así, se lanza un error con el mensaje 'Usuario no registrado'.
    2. Se utiliza bcrypt.compareSync para comparar la contraseña proporcionada (password) con la contraseña almacenada 
    en la base de datos.. Si las contraseñas no coinciden, se lanza un error con el mensaje 
    'Usuario y / o contraseña incorrectos'.
    */
    if (!wantedUser) {
        throw 'Usuario no registrado'
    } else {
        const passwordMatch = bcrypt.compareSync(password, wantedUser.password)
        if (!passwordMatch) {
            throw 'Usuario y / o contraseña incorrectos'
        }
    }

    // Generar un token de acceso utilizando jwt.sign
    const accessToken = jwt.sign({ userId: wantedUser.id }, secretKey, { expiresIn: '1h' });

    //Crear un objeto de respuesta que contiene la información del usuario y el accessToken
    const objectUser = {
        id: wantedUser.id,
        firstName: wantedUser.firstName,
        lastName: wantedUser.lastName,
        email: wantedUser.email,
        accessToken: accessToken
    }

    // Se retorna el objeto objectUser, que contiene la información del usuario y el token de acceso.
    return objectUser;
}