/*
8. En la carpeta routes contiene la definición de las rutas en los siguientes archivos:
- bootcamp.routes.js: define las rutas para los bootcamp
*/


// Declarar constante express, que importa del módulo express
const express = require('express')
    // Utilizar la destructuración para extraer la propiedad Router del módulo express
const { Router } = express
// Declarar una instancia de un router utilizando la propiedad Router extraísda del módulo express
const router = Router()
    // Declarar una constante llamada userController que importa el módulo user.controller.js
const bootcampController = require('./../controllers/bootcamp.controller')

// Declarar un constante validations que importa el módulo index.js
const validations = require('./../middleware/index')
    // Declarar una constante emailValidations que asigna la función validateEmail importada del módulo validations
const emailValidations = validations.validateEmail
    // Declarar una constante tokenValidations que asigna la función validateToken importada del módulo validations
const tokenValidations = validations.validateToken

// Declarar una variable llamada decodeTokenID donde se almacenarán los resultados de la decodificación del token
let decodeTokenID

// Requerimiento: proveeer las siguientes endpoint:
// MÉTODO POST URL /api/bootcamp ACCIÓN Crear un bootcamp ACCESO por medio de un token, previamente iniciada la sesión

// MÉTODO POST URL /api/bootcamp/addUser ACCIÓN Agregar usuarios previamente registrados a un bootcamp ACCESO por medio de un token, previamente iniciada la sesión

// MÉTODO GET URL /api/bootcamp/:id ACCIÓN Obtener información de un bootcamp según id y muestra los usuarios registrados en el Bootcamp ACCESO por medio de un token, previamente iniciada la sesión

// MÉTODO GET URL /api/bootcamp ACCIÓN Listar todos los bootcamp ACCESO público