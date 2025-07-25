const express = require("express");//importamos el paquete express
const router = express.Router();//importamos la utilidad de express que nos permite definir las rutas
//importamos el controlador que indicará las instrucciones que debe cumplir una ruta
const postController = require("../controllers/postController");
const auth = require("../middlewares/authmiddleware"); //middleware de autenticación

//se crean los endpoints, con el metodo http correspondiente, el nombre de la ruta y el controlador asociado a cada una

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post.
 *     tags:
 *       - Posts
 *     security:
 *       - ApiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: The title of the post.
 *                 example: My first post
 *               contenido:
 *                 type: string
 *                 description: The content of the post.
 *                 example: This is the content of my first post.
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 id_usuario:
 *                   type: integer
 *                   example: 10
 *                 titulo:
 *                   type: string
 *                   example: My first post
 *                 contenido:
 *                   type: string
 *                   example: This is the content of my first post.
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bad request
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.post("/create", auth, postController.createPost);//crea un nuevo post con usuario autenticado

/**
 * @swagger
 * /posts/get:
 *   get:
 *     summary: Retrieve posts created by the authenticated user.
 *     tags:
 *       - Posts
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: List of posts created by the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   id_usuario:
 *                     type: integer
 *                     example: 10
 *                   titulo:
 *                     type: string
 *                     example: My first post
 *                   contenido:
 *                     type: string
 *                     example: This is the content of my first post.
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       nombre:
 *                         type: string
 *                         example: John Doe
 *                       mail:
 *                         type: string
 *                         example: johndoe@example.com
 *       404:
 *         description: No posts found for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No posts found
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.get("/get", auth, postController.getPosts);//obtiene los posts de un usuario autenticado

/**
 * @swagger
 * /posts/update/{id}:
 *   put:
 *     summary: Update a post created by the authenticated user.
 *     tags:
 *       - Posts
 *     security:
 *       - ApiTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Updated title
 *               contenido:
 *                 type: string
 *                 example: Updated content of the post.
 *     responses:
 *       200:
 *         description: Post successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Modification successful
 *                 post:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: Updated title
 *                     contenido:
 *                       type: string
 *                       example: Updated content of the post.
 *       403:
 *         description: User is not authorized to update this post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized to modify this post.
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.put("/update/:id", auth, postController.updatePost);//modifica un post de un usuario autenticado

/**
 * @swagger
 * /posts/delete/{id}:
 *   delete:
 *     summary: Delete a post created by the authenticated user.
 *     tags:
 *       - Posts
 *     security:
 *       - ApiTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Post successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post deleted successfully.
 *       403:
 *         description: User is not authorized to delete this post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized to delete this post.
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */
router.delete("/delete/:id", auth, postController.deletePost);//elimina un post de un usuario autenticado


/**
 * @swagger
 * /posts/getpost/{id}:
 *   get:
 *     summary: Get a specific post by ID from an authenticated user or a followed user.
 *     tags:
 *       - Posts
 *     security:
 *       - ApiTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Post successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 titulo:
 *                   type: string
 *                   example: "Example Post Title"
 *                 contenido:
 *                   type: string
 *                   example: "This is an example post content."
 *                 id_usuario:
 *                   type: integer
 *                   example: 2
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     nombre:
 *                       type: string
 *                       example: "John Doe"
 *                     nickname:
 *                       type: string
 *                       example: "johnd"
 *                     mail:
 *                       type: string
 *                       example: "johndoe@example.com"
 *       403:
 *         description: User is not authorized to access the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to access this post."
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 *                 error:
 *                   type: string
 *                   example: "Detailed error message."
 */
router.get("/getpost/:id", auth, postController.getUserPost);//obtiene un post por id, del usuario autenticado o de un usuario seguido

/**
 * @swagger
 * /posts/user-posts/{id}:
 *   get:
 *     summary: Get posts from a specific user, only if the authenticated user follows them.
 *     tags:
 *       - Posts
 *     security:
 *       - ApiTokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user whose posts you want to retrieve.
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Posts from the followed user successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   titulo:
 *                     type: string
 *                     example: "Example Post Title"
 *                   contenido:
 *                     type: string
 *                     example: "This is an example post content."
 *                   id_usuario:
 *                     type: integer
 *                     example: 2
 *                   usuario:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       nombre:
 *                         type: string
 *                         example: "John Doe"
 *                       nickname:
 *                         type: string
 *                         example: "johnd"
 *                       mail:
 *                         type: string
 *                         example: "johndoe@example.com"
 *       403:
 *         description: User is not following the requested user or is trying to access their own posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are not authorized to access this post."
 *       404:
 *         description: User has no posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The user has no posts."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 *                 error:
 *                   type: string
 *                   example: "Detailed error message."
 */
router.get("/user-posts/:id", auth, postController.getPostFrom);//obtiene los posts de un usuario seguido

//adicionales
router.get("/", postController.home);

module.exports = router;