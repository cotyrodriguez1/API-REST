const swaggerJsDoc = require("swagger-jsdoc");//importa el paquete js doc

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0", //estandar de definicion de API REST
        info: { //información de la API
            title: "Api Red Social",
            version: "1.0.0",
            description: "Documentación de la Api de Red Social",
        },
        servers:[{
            url: "http://localhost:3000/api",
            description: "Servidor local",
        }],
        components: {
            securitySchemes: {//agregamos el esquema para el funcionamiento del token
                ApiTokenAuth: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization", 
                }
            }
        },
        security: [{
            ApiTokenAuth: [], //define ApiTokenAuth como seguridad por defecto
        }],
    },
    apis: ["./routes/*.js"] //busca todos los archivos que terminen en .js dentro de la carpeta de rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions); //guarda un objeto jsdoc con las opctiones que definimos ateriormente
module.exports = swaggerDocs; 