/*
8. En la carpeta routes contiene la definición de las rutas en los siguientes archivos:
- user.routes.js: define las rutas de los usuarios
*/


// Declarar constante express, que importa del módulo express
const express = require('express')
    // Utilizar la destructuración para extraer la propiedad Router del módulo express
const { Router } = express
// Declarar una instancia de un router utilizando la propiedad Router extraísda del módulo express
const router = Router()
    // Declarar una constante llamada userController que importa el módulo user.controller.js
const userController = require('./../controllers/user.controller')

// Declarar un constante validations que importa el módulo index.js
const validations = require('./../middleware/index')
    // Declarar una constante emailValidations que asigna la función validateEmail importada del módulo validations
const emailValidations = validations.validateEmail
    // Declarar una constante tokenValidations que asigna la función validateToken importada del módulo validations
const tokenValidations = validations.validateToken

// Declarar una variable llamada decodeTokenID donde se almacenarán los resultados de la decodificación del token
let decodeTokenID

// middleware
router.use((request, response, next) => {
    const headToken = request.headers.authorization
    const decodeToken = tokenValidations.decodeToken(headToken)
    if (request.url === '/api/signup' || request.url === '/api/signin') {
        next()
    } else {
        if (decodeToken.code !== '000') {
            return response.status(403).json({ success: false, message: 'Token inválido' })
        } else {
            decodeTokenID = decodeToken.payload.id
            next()
        }
    }
})

// Requerimiento: proveeer las siguientes endpoint:
// MÉTODO POST URL /api/signup ACCIÓN Registro de un nuevo usuario ACCESO público
router.post('/api/signup', async(request, response) => {

    if (!request.body.firstName) {
        return response.status(400).json({ success: false, message: 'Debe Indicar el Nombre del Usuario' })
    }
    if (!request.body.lastName) {
        return response.status(400).json({ success: false, message: 'Debe Indicar el Apellido del Usuario' })
    }
    if (!request.body.email) {
        return response.status(400).json({ success: false, message: 'Debe Indicar el Correo del Usuario' })
    } else {
        const validEmail = await emailValidations.validateEmail(request.body.email)
        if (validEmail) {
            return response.status(400).json({ success: false, message: 'El correo indicado ya esta en uso' })
        }
    }
    if (!request.body.password) {
        return response.status(400).json({ success: false, message: 'Debe Indicar una contraseña para el Usuario' })
    } else if (request.body.password.length < 8) {
        return response.status(400).json({ success: false, message: 'El password debe tener al menos 8 caracteres' })
    }

    try {
        const usuario = await userController.createUser(request.body)
        return response.json({ success: true, data: usuario })
    } catch (err) {
        return response.status(1).json({ success: false, message: 'as', data: err })
    }
})

// MÉTODO POST URL /api/signin ACCIÓN Inicio de sesión en la API ACCESO público
router.post('/api/signin', async(request, response) => {
    try {
        const token = await userController.loginUser(request.body)
        return response.json({ success: true, message: 'Usuario Encontrado', data: token })
    } catch (err) {
        return response.status(404).json({ success: false, message: err })
    }
})

// MÉTODO GET URL /api/user/:id ACCIÓN Lista información del usuario según id ACCESO por medio de token, previamente inciada la sesión
router.get('/api/user/:id', async(request, response) => {
    const idUser = request.params.id
    const wantedUser = await userController.findUserById(idUser)
    return response.json({ success: true, message: 'Usuario Encontrado', data: wantedUser })
})

// MÉTODO GET URL /api/user/ ACCIÓN Lista información de todos los usuarios y los Bootcamp registrados ACCESO por medio de token, previamente inciada la sesión
router.get('/api/user', async(request, response) => {
    const wantedUSers = await userController.findAll()
    return response.json({ success: true, message: 'Listado de Usuarios', data: wantedUSers })
})

// MÉTODO PUT URL /api/user/:id ACCIÓN Actualiza los campos firstName y lastName de un usuario según su ID ACCESO por medio de token, previamente inciada la sesión
router.put('/api/user/:id', async(request, response) => {
    const idUser = request.params.id
    if (Number(idUser) !== Number(decodeTokenID)) {
        return response.status(400).json({ success: false, message: 'Solo puede editar SU información' })
    }
    const { firstName, lastName } = request.body
    if (!firstName && !lastName) {
        return response.status(400).json({ success: false, message: 'Debe Indicar Nombre o Apellido a actualizar' })
    }
    const updatedUser = await userController.updateUserById(idUser, firstName, lastName)
    return response.json({ success: true, message: 'Usuario Actualizado' })
})

// MÉTODO DELETE URL /api/user/:id ACCIÓN Eliminar el usuario según ID ACCESO por medio de token, previamente inciada la sesión
/*t*/
//router.delete('/api/user/:id')


module.exports = router