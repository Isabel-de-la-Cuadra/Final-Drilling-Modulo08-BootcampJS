/*
6. En la carpeta controllers posee los controladores tanto para el usuario como para el bootcamp (bootcamp.controller.js)
Para el usuario se deben adecuar los siguientes controladores para la API:
- Crear y guardar un nuevo bootcamp llamado createBootcamp
- Agregar un usuario al bootcamp llamado addUser
- Obtener los bootcamp por id llamado findById
- Obtener todos los Usuarios incluyendo los bootcamp llamado findAll
*/

const { users, bootcamps } = require('../models')
const db = require('../models')
const Bootcamp = db.bootcamps
const User = db.users

// Crear y guardar un nuevo bootcamp | Proporcionado primer Sprint
exports.createBootcamp = (bootcamp) => {
    return Bootcamp.create({
            title: bootcamp.title,
            cue: bootcamp.cue,
            description: bootcamp.description,
        })
        .then(bootcamp => {
            console.log(`>> Creado el bootcamp: ${JSON.stringify(bootcamp, null, 4)}`)
            return bootcamp
        })
        .catch(err => {
            console.log(`>> Error al crear el bootcamp: ${err}`)
        })
}

// Agregar un Usuario al Bootcamp | Proporcionado primer Sprint
exports.addUser = (bootcampId, userId) => {
    return Bootcamp.findByPk(bootcampId)
        .then((bootcamp) => {
            if (!bootcamp) {
                console.log("No se encontro el Bootcamp!");
                return null;
            }
            return User.findByPk(userId).then((user) => {
                if (!user) {
                    console.log("Usuario no encontrado!");
                    return null;
                }
                bootcamp.addUser(user);
                console.log('***************************')
                console.log(` Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`);
                console.log('***************************')
                return bootcamp;
            });
        })
        .catch((err) => {
            console.log(">> Error mientras se estaba agregando Usuario al Bootcamp", err);
        });
};


// obtener los bootcamp por id | Proporcionado primer Sprint
exports.findById = (Id) => {
    return Bootcamp.findByPk(Id, {
            include: [{
                model: User,
                as: "users",
                attributes: ["id", "firstName", "lastName"],
                through: {
                    attributes: [],
                }
            }, ],
        })
        .then(bootcamp => {
            return bootcamp
        })
        .catch(err => {
            console.log(`>> Error mientras se encontraba el bootcamp: ${err}`)
        })
}

// obtener todos los Usuarios incluyendo los Bootcamp | Proporcionado primer Sprint
exports.findAll = () => {
    return Bootcamp.findAll({
        include: [{
            model: User,
            as: "users",
            attributes: ["id", "firstName", "lastName"],
            through: {
                attributes: [],
            }
        }, ],
    }).then(bootcamps => {
        return bootcamps
    }).catch((err) => {
        console.log(">> Error Buscando los Bootcamps: ", err);
    });
}