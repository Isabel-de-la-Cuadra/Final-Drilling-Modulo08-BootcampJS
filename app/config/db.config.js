/*
4. Crear dentro de la carpeta config, el archivo db.config.js, que posee la configuración a la base
de datos, el nombre de la base de datos es: db_jwtbootcamp
*/

// Exportar el objeto de conexión a la base de datos. El user y el password hay que cambiarlos, acá están como postgres, postgres
module.exports = {
    HOST: 'localhost',
    USER: 'postgres',
    PASSWORD: 'postgres',
    DB: 'db_jwtbootcamp',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}