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
        return response.json({ success: true, data: bootcamp })

        // Mostrar error en la ejecución del código
    } catch (error) {
        return response.status(500).json({ success: false, message: 'Error en el servidor', data: error })
    }
})


// MÉTODO POST URL /api/bootcamp/addUser ACCIÓN Agregar usuarios previamente registrados a un bootcamp ACCESO por medio de un token, previamente iniciada la sesión

// MÉTODO GET URL /api/bootcamp/:id ACCIÓN Obtener información de un bootcamp según id y muestra los usuarios registrados en el Bootcamp ACCESO por medio de un token, previamente iniciada la sesión

// MÉTODO GET URL /api/bootcamp ACCIÓN Listar todos los bootcamp ACCESO público


module.exports = router;