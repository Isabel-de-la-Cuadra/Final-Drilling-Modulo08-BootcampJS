/*
8. En la carpeta routes contiene la definición de las rutas en los siguientes archivos:
- bootcamp.routes.js: define las rutas para los bootcamp
*/

// Declarar constante express, que importa del módulo express
const express = require('express')

// Utilizar la destructuración para extraer la propiedad Router del módulo express
const { Router } = express

// Declarar una instancia de un router utilizando la propiedad Router extraída del módulo express
const router = Router()

// Declarar una constante llamada bootcampController que importa el módulo user.controller.js
const bootcampController = require('./../controllers/bootcamp.controller')

// Declarar una constante llamada userController que importa el módulo user.controller.js
const userController = require('../controllers/user.controller')

// Declarar un constante validations que importa el módulo index.js
const validations = require('./../middleware/index')

// Requerimiento: proveeer las siguientes endpoint:

// MÉTODO POST URL /api/bootcamp ACCIÓN Crear un bootcamp ACCESO por medio de un token, previamente iniciada la sesión
router.post('/api/bootcamp', validations.verifyToken, async(request, response) => {
    // Confirmar que viene toda la información del bootcamp por crear
    try {
        if (!request.body.title) {
            return response.status(400).json({ success: false, message: 'Debe Indicar el Title del Bootcamp' })
        }
        if (!request.body.cue) {
            return response.status(400).json({ success: false, message: 'Debe Indicar Cue del Bootcamp' })
        }
        if (!request.body.description) {
            return response.status(400).json({ success: false, message: 'Debe Indicar la Description del Bootcamp' })
        }

        // Si viene toda la información y cumple con los requisitos, se crea un bootcamp
        const bootcamp = await bootcampController.createBootcamp(request.body)

        // Retornar respuesta JSON
        return response.json({ success: true, data: bootcamp })


    } catch (error) {
        // Retornar error en la ejecución del código
        return response.status(500).json({ success: false, message: 'Error en el servidor', data: error })
    }
})

// MÉTODO POST URL /api/bootcamp/addUser ACCIÓN Agregar usuarios previamente registrados a un bootcamp ACCESO por medio de un token, previamente iniciada la sesión
// SOLO SE PUEDE MATRICULAR EL USUARIO CON EL TOKEN A UN BOOTCAMP. NO PUEDE MATRICULAR A OTROS USUARIOS A UN BOOTCAMP
router.post('/api/bootcamp/addUser', validations.verifyToken, async(request, response) => {
    try {

        // Obtener el ID del usuario autenticado desde el token
        const userId = Number(request.userId);

        // Obtener el ID del bootcamp desde el body
        const bootcampId = Number(request.body.bootcampId);

        // Obtener los bootcamps asociados al usuario
        const userBootcamps = await userController.findUserById(userId);

        // Verificar si el bootcampId ya está en la lista de bootcamps del usuario
        const isUserInBootcamp = userBootcamps.bootcamps.some(bootcamp => bootcamp.id === bootcampId);

        if (isUserInBootcamp) {
            return response.status(400).json({ success: false, message: 'El usuario ya está inscrito en el bootcamp' });
        }

        // Verificar si el bootcamp existe
        const bootcamp = await bootcampController.findById(bootcampId);
        if (!bootcamp) {
            return response.status(404).json({ success: false, message: 'Bootcamp no encontrado' });
        }

        // Agregar el usuario al bootcamp
        const result = await bootcampController.addUser(bootcampId, userId);
        if (!result) {
            return response.status(500).json({ success: false, message: 'Error al agregar usuario al bootcamp' });
        }

        // Retornar respuesta JSON
        return response.json({ success: true, message: 'Usuario agregado exitosamente al bootcamp' });
    } catch (error) {
        // Retornar error en la ejecución del código
        return response.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
});

// MÉTODO GET URL /api/bootcamp/:id ACCIÓN Obtener información de un bootcamp según id y muestra los usuarios registrados en el Bootcamp ACCESO por medio de un token, previamente iniciada la sesión
router.get('/api/bootcamp/:id', validations.verifyToken, async(request, response) => {
    try {
        // Obtener el ID del bootcamp desde los parámetros de la URL
        const bootcampId = Number(request.params.id);

        // Obtener la información del bootcamp por su ID y también los usuarios registrados en él
        const bootcampWithUsers = await bootcampController.findById(bootcampId);

        // Condicional si no existe el bootcamp
        if (!bootcampWithUsers) {
            return response.status(404).json({ success: false, message: 'Bootcamp no encontrado' });
        }

        // Retornar respuesta JSON
        return response.json({ success: true, data: bootcampWithUsers });
    } catch (error) {
        // Retornar error en la ejecución del código
        return response.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
});

// MÉTODO GET URL /api/bootcamp ACCIÓN Listar todos los bootcamp ACCESO público
router.get('/api/bootcamp', async(request, response) => {
    try {
        // Obtener la lista de bootcamps desde el controlador
        const bootcamps = await bootcampController.findAll();

        // Filtrar los atributos que se muestran, para que no se incluyan los usuarios registrados
        const filteredBootcamps = bootcamps.map(bootcamp => {
            return {
                id: bootcamp.id,
                title: bootcamp.title,
                cue: bootcamp.cue,
                description: bootcamp.description,
                createdAt: bootcamp.createdAt,
                updatedAt: bootcamp.updatedAt
            };
        });

        // Retornar respuesta JSON
        return response.json({ success: true, data: filteredBootcamps });
    } catch (error) {
        // Retornar error en la ejecución del código
        return response.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
});

// Exportar router para que esté disponible en otras partes del proyecto
module.exports = router;