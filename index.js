const express = require("express"); //se importa el paquete de express
const bodyParser = require("body-parser"); //se importa el paquete de body parser
const app = express() //se crea la aplicación de express
const PORT = 3000;

require('dotenv').config();


const usuarioRouter = require("./routes/usuarioRoutes");//importamos las rutas de usuario en el index
//const authRouter = require("./routes/authRoutes");//importamos las rutas de auth
const postRouter = require("./routes/postRoutes");//importamos las rutas de los posts
const followingRouter = require("./routes/followingRoutes");//importamos las rutas de los followings
const path  = require("path");//para el avatar

const swaggerUi = require("swagger-ui-express"); //para swagger
const swaggerDocs = require("./swaggerConfig"); //para swagger

app.use(bodyParser.json());//se configura para que todas las respuestas sean dadas en formato json
app.use(express.urlencoded({ extended: true }));//se configura para parsear los datos de formulario desde postman

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));//generamos la ruta para el swagger

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/api/usuarios", usuarioRouter);//configura la ruta principal y usa las rutas de usuario
app.use("/api/posts", postRouter);//configura la ruta principal para los posts
app.use("/api/following", followingRouter);//configura la ruta principal para los seguimientos

app.listen(PORT, () => {
    console.log("aplicacion corriendo")
})