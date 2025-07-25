const express = require("express");//importamos el paquete express
const router = express.Router();//importamos la utilidad de express que nos permite definir las rutas
const followingController = require("../controllers/followingController");//importamos el controlador de los seguimientos
const auth = require("../middlewares/authmiddleware"); //middleware de autenticación

//se crean los endpoints, con el metodo http correspondiente, el nombre de la ruta y el controlador asociado a cada una

/**
 * @swagger
 * /following/follow:
 *   post:
 *     summary: Follow a new user.
 *     tags:
 *       - Following
 *     security:
 *       - ApiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario_seguido:
 *                 type: integer
 *                 description: The ID of the user to follow.
 *                 example: 3
 *     responses:
 *       201:
 *         description: Successfully followed the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are now following the user."
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     nombre:
 *                       type: string
 *                       example: "John Doe"
 *                     nickname:
 *                       type: string
 *                       example: "johnd"
 *       400:
 *         description: User cannot follow themselves.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You cannot follow yourself."
 *       401:
 *         description: The user is already following the requested user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are already following this user."
 *       404:
 *         description: User to follow does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User does not exist."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error message"
 *                 tipo:
 *                   type: string
 *                   example: "SequelizeUniqueConstraintError"
 */
router.post("/follow", auth, followingController.createFollow);//seguir a un nuevo usuario

/**
 * @swagger
 * /following/unfollow:
 *   delete:
 *     summary: Unfollow a user.
 *     tags:
 *       - Following
 *     security:
 *       - ApiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario_seguido:
 *                 type: integer
 *                 description: The ID of the user to unfollow.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Successfully unfollowed the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You have unfollowed the user."
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     nombre:
 *                       type: string
 *                       example: "John Doe"
 *                     nickname:
 *                       type: string
 *                       example: "johnd"
 *       400:
 *         description: Cannot unfollow yourself.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You cannot unfollow yourself."
 *       404:
 *         description: User to unfollow does not exist or the user is not following the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found or You are not following this user."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */
router.delete("/unfollow", auth, followingController.unfollow);//eliminar una relación de seguimiento

/**
 * @swagger
 * /following/followed:
 *   get:
 *     summary: List all users followed by the authenticated user.
 *     tags:
 *       - Following
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: List of users that the authenticated user is following.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 2
 *                   nombre:
 *                     type: string
 *                     example: "Jane Doe"
 *                   nickname:
 *                     type: string
 *                     example: "janed"
 *                   mail:
 *                     type: string
 *                     example: "janedoe@example.com"
 *       404:
 *         description: No users found or the authenticated user is not following anyone.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found or You are not following anyone."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */
router.get("/followed", auth, followingController.followed);//lista todos los usuarios que un usuario autenticado sigue

/**
 * @swagger
 * /following/followers:
 *   get:
 *     summary: List all users who are following the authenticated user.
 *     tags:
 *       - Following
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: List of users who are following the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 3
 *                   nombre:
 *                     type: string
 *                     example: "John Smith"
 *                   nickname:
 *                     type: string
 *                     example: "johns"
 *                   mail:
 *                     type: string
 *                     example: "johnsmith@example.com"
 *       404:
 *         description: No followers found or the authenticated user does not have any followers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found or You have no followers."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */
router.get("/followers", auth, followingController.followers);//lista todos los seguidores que un usuario autenticado tiene

/**
 * @swagger
 * /following/mutual:
 *   get:
 *     summary: List all users with mutual following (both following and being followed).
 *     tags:
 *       - Following
 *     security:
 *       - ApiTokenAuth: []
 *     responses:
 *       200:
 *         description: List of users with mutual following (both following and being followed).
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 4
 *                   nombre:
 *                     type: string
 *                     example: "Alice Johnson"
 *                   nickname:
 *                     type: string
 *                     example: "alicej"
 *                   mail:
 *                     type: string
 *                     example: "alicejohnson@example.com"
 *       404:
 *         description: No mutual followers found or the authenticated user has no mutual followers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No mutual followers found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error message"
 */
router.get("/mutual", auth, followingController.mutual);//lista los usuarios con seguimiento mutuo

module.exports = router;