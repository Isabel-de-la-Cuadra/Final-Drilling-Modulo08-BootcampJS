// Declaración de una constante jwt que importa el módulo node.jwt
const jwt = require('node.jwt')

/*
Declaración de una constante secretKey que utiliza el método jwt.secret para generar una clave secreta para la firma y verificación de JWT, 
se le pasa la cadena de caracteres que servirán para generar la clave secreta. Acá se usa 'finalDrillingModulo8'
*/
const secretKey = jwt.secret('finalDrillingModulo8')

//Exportar la cosntante secretKey
module.exports = secretKey

/*
4. Crear dentro de la carpeta config, el archivo auth.confir.js que contendrá la frase secreta para la creación del token. 
*/