const express = require("express");// importamos el paquete de express
const router = express.Router(); //importamos la utilidad de express que nos permite definir las rutas
const auth = require("../middlewares/authmiddleware");
const upload = require("../middlewares/uploadMiddleware");//middleware para la subida de imagenes
//importamos el controlador que indicará las instrucciones que debe cumplir una ruta
const usuarioController = require("../controllers/usuarioController");


//se crean los endpoints, con el metodo http correspondiente, el nombre de la ruta y el controlador asociado a cada una

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Register a new user.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                  type: string
 *               nickname:
 *                  type: string
 *               mail:
 *                  type: string
 *                  format: email
 *               password:
 *                  type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 mail:
 *                   type: string
 *       400:
 *         description: Error en la solicitud (datos faltantes ).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Todos los campos son obligatorios
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error interno del servidor.
 */
router.post("/register", usuarioController.register);//registra a un nuevo usuario

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Autenticar a un usuario.
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - mail
 *               - password
 *             properties:
 *               mail:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario.
 *                 example: usuario@mail.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Devuelve el token de autenticación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Error en la solicitud (faltan datos o contraseña incorrecta).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error en el servidor
 *                 error:
 *                   type: string
 *                   example: "Detalles del error interno."
 */
router.post("/login", usuarioController.login);//autentica a un usuario mediante mail y password

/**
 * @swagger
 * /usuarios/list:
 *   get:
 *     tags: [Usuarios]
 *     summary: List all users with pagination
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 itemsPerPage:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       nickname:
 *                         type: string
 *                       mail:
 *                         type: string
 *                         format: email
 *       400:
 *         description: Bad request - page or limit must be positive
 *       500:
 *         description: Internal server error
 */
router.get("/list", usuarioController.list);//lista a todos los usuarios registrados

/**
 * @swagger
 * /usuarios/me:
 *   put:
 *     tags: [Usuarios]
 *     summary: Update current user's profile
 *     security:
 *       - ApiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               nickname:
 *                 type: string
 *               mail:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: User not found
 */
router.put("/me", auth, upload.single('avatar'), usuarioController.update);//permite al usuario editar su perfil (requiere autenticación)

//adiciones:
router.get("/", usuarioController.home);//ruta principal de usuario
router.get("/info/:id", usuarioController.findById); //Se le pasa por parametro el id del usuario a buscar

module.exports = router; //indicamos que el recurso router este disponible desde fuera del archivos
