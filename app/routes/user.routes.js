/*
8. En la carpeta routes contiene la definición de las rutas en los siguientes archivos:
- user.routes.js: define las rutas de los usuarios
*/

// Declarar constante express, que importa del módulo express
const express = require('express')

// Utilizar la destructuración para extraer la propiedad Router del módulo express
const { Router } = express

// Declarar una instancia de un router utilizando la propiedad Router extraída del módulo express
const router = Router()

// Declarar una constante llamada userController que importa el módulo user.controller.js
const userController = require('../controllers/user.controller')

// Importa el módulo index.js
const validations = require('../middleware/index')

// Requerimiento: proveeer las siguientes endpoint:

// MÉTODO POST URL /api/signup ACCIÓN Registro de un nuevo usuario ACCESO público
router.post('/api/signup', async(request, response) => {
    // Confirmar que viene toda la información del usuario por crear
    try {
        if (!request.body.firstName) {
            return response.status(400).json({ success: false, message: 'Debe Indicar el Nombre del Usuario' })
        }
        if (!request.body.lastName) {
            return response.status(400).json({ success: false, message: 'Debe Indicar el Apellido del Usuario' })
        }
        if (!request.body.email) {
            return response.status(400).json({ success: false, message: 'Debe Indicar el Correo del Usuario' })
        } else {
            // Si viene el email, hay que confirmar que no se encuentre en la base de datos
            const emailIsInUse = await validations.verifySingUp(request.body.email)
            if (emailIsInUse) {
                return response.status(400).json({ success: false, message: 'El correo indicado ya esta en uso' })
            }
        }
        if (!request.body.password) {
            return response.status(400).json({ success: false, message: 'Debe Indicar una contraseña para el Usuario' })

            // Confirmar que el password tenga más de 8 caracteres    
        } else if (request.body.password.length < 8) {
            return response.status(400).json({ success: false, message: 'El password debe tener al menos 8 caracteres' })
        }

        // Si viene toda la información y cumple con los requisitos, se crea un usuario
        const user = await userController.createUser(request.body)
        return response.json({ success: true, data: user })

        // Mostrar error en la ejecución del código
    } catch (error) {
        return response.status(500).json({ success: false, message: 'Error en el servidor', data: error })
    }
})

// MÉTODO POST URL /api/signin ACCIÓN Inicio de sesión en la API ACCESO público
router.post('/api/signin', async(request, response) => {
    try {
        const token = await userController.loginUser(request.body)
        return response.json({ success: true, message: 'Usuario Encontrado', data: token })
    } catch (error) {
        return response.status(404).json({ success: false, message: error })
    }
})

// MÉTODO GET URL /api/user/:id ACCIÓN Lista información del usuario según id ACCESO por medio de token, previamente iniciada la sesión
router.get('/api/user/:id', validations.verifyToken, async(request, response) => {
    try {
        const idUser = request.params.id

        // Verificar si el Id del usuario en el token coindicde con el id del parámetro
        if (Number(idUser) !== Number(request.userId)) {
            return response.status(403).json({ success: false, message: 'Acceso denegado' });
        }

        // Crear una constante para almacenar la información del user
        const wantedUser = await userController.findUserById(idUser)
        if (!wantedUser) {
            return response.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        return response.json({ success: true, data: wantedUser });
    } catch (error) {
        return response.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
});

// MÉTODO GET URL /api/user/ ACCIÓN Lista información de todos los usuarios y los Bootcamp registrados ACCESO por medio de token, previamente iniciada la sesión
router.get('/api/user', validations.verifyToken, async(request, response) => {
    try {
        const wantedUsers = await userController.findAll()
        return response.json({ success: true, message: 'Listado de Usuarios', data: wantedUsers })
    } catch (error) {
        return response.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
})

// MÉTODO PUT URL /api/user/:id ACCIÓN Actualiza los campos firstName y lastName de un usuario según su ID ACCESO por medio de token, previamente iniciada la sesión
router.put('/api/user/:id', validations.verifyToken, async(request, response) => {
    try {
        const idUser = request.params.id

        // Verificar si el Id del usuario en el token coindicde con el id del parámetro
        if (Number(idUser) !== Number(request.userId)) {
            return response.status(403).json({ success: false, message: 'Acceso denegado, solo puedes editar tu información' });
        }

        // Crear una constante para firstName y lastName, con la información a modificar que viene por el request.body
        const { firstName, lastName } = request.body

        // Validar si se proporcionó al menos un valor para actualizar
        if ((!firstName || typeof firstName !== 'string') && (!lastName || typeof lastName !== 'string')) {
            return response.status(400).json({ success: false, message: 'Debe indicar un nombre o apellido válido para actualizar' });
        }

        // Actualizar el usuario y capturar el resultado
        const updatedUser = await userController.updateUserById(idUser, firstName, lastName)

        // Verificar si la actualización fue exitosa
        if (!updatedUser) {
            return response.status(404).json({ success: false, message: 'Usuario no encontrado o no pudo ser actualizado' });
        }

        // Devolver información actualizada del usuario
        return response.json({ success: true, message: 'Usuario Actualizado', data: updatedUser });

    } catch (error) {
        return response.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
})

// MÉTODO DELETE URL /api/user/:id ACCIÓN Eliminar el usuario según ID ACCESO por medio de token, previamente inciada la sesión
router.delete('/api/user/:id', validations.verifyToken, async(request, response) => {
    try {
        const idUser = request.params.id

        // Verificar si el Id del usuario en el token coindicde con el id del parámetro
        if (Number(idUser) !== Number(request.userId)) {
            return response.status(403).json({ success: false, message: 'Acceso denegado, solo puedes borrar tu información' });
        }

        // Actualizar el usuario y capturar el resultado
        const deletedUser = await userController.deleteUserById(idUser)

        // Verificar si la actualización fue exitosa
        if (!deletedUser) {
            return response.status(404).json({ success: false, message: 'Usuario no encontrado o no pudo ser borrado' });
        }

        // Devolver información actualizada del usuario
        return response.json({ success: true, message: 'Usuario Borrado', data: deletedUser });

    } catch (error) {
        return response.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
})



module.exports = router;