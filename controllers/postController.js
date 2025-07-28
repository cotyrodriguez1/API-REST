const db = require("../models"); 
const Usuario = db.usuario;
const Post = db.Post 
const Following = db.Following 

//funcion para la ruta principal de post
const home = (req, res) =>{
    res.status(200).send("ruta principal de posts");
};

//funcion para crear un nuevo post
const createPost = async (req, res) => {
    const {titulo, contenido} = req.body;
    
    if (!titulo || !contenido) {
        return res.status(400).send({message: "No puede haber campos vacíos"})
    }

    try {
        //valida que el usuario esté autenticado (req.user viene del middleware)
        if (!req.user){
            return res.status(401).send({ message: "No autorizado" });
        }
        //crea el post con el usuario autenticado
        const post = await Post.create({
            id_usuario: req.user.id, //asocia el post al usuario autenticado
            titulo,
            contenido,
        })
        res.status(201).send(post); //devuelve el post creado
    } catch (error) {
       res.status(500).send({message: "Error del interno servidor"}) 
    }
}

//función para listar los posts de un usuario autenticado
const getPosts = async (req, res) => {
    try {
        const userId = req.user.id; //obtiene el ID del usuario autenticado desde el middleware

        //busca los posts del usuario autenticado
        const posts = await Post.findAll({
            where: { id_usuario: userId }, //filtra por el ID del usuario autenticado
            include: {
                model: db.usuario,
                attributes: ["id", "nombre", "mail"], //incluye los datos básicos del usuario
            },
        });

        //valida si el usuario no tiene posts
        if (posts.length === 0) {//devolvemos error 404 Not Found
            return res.status(404).send({ message: "No tienes posts creados" });
        }

        res.status(200).send(posts);
    } catch (error) {
        console.error("Error al obtener los posts del usuario autenticado:", error);
        res.status(500).send({message: "Error interno del servidor",});
    }
};

//funcion para modificar un post de un usuario autenticado:
const updatePost = async (req, res) => {
    try {
        //extrae el id del usuario autenticado desde el middleware
        const userId = req.user.id;

        //guarda el titulo y contenido desde el cuerpo de la solicitud
        const {titulo, contenido} =  req.body;

        //busca el post por el id
        const post = await Post.findByPk(req.params.id);
        if (!post){//si no encuentra el post por id lanza error 404 Not Found
            return res.status(404).send({message: "Post no encontrado"})
        }
        //validamos que el post encontrado sea el del usuario autenticado
        if (post.id_usuario !== userId){
            return res.status(403).send({ message: "No autorizado para modificar esta publicación" });
        }

        //actualiza los campos:
        post.titulo = titulo || post.titulo;
        post.contenido = contenido || post.contenido;

        //guarda los cambios en la base de datos
        await post.save();

        //devolvemos un mensaje y la publicación modificada
        res.status(200).send({message:"modificación exitosa", post})

    } catch (error) {
        res.status(500).send({message: "Error interno del servidor"})
    }
}
//funcion para eliminar una publicación de un usuario autenticado
const deletePost = async (req, res) => {
    try {
        //extrae el ID del usuario autenticado
        const userId = req.user.id;
        const postId = req.params.id;
        //busca en la base de datos el post por su id
        const post = await Post.findByPk(postId);
        if (!post) {//valida si la busqueda fue exitosa, de lo contrario devuelve error 404 Not Found
            return res.status(404).send({message: "Post no encontrado"});
        }
        //verifica que el post a eliminar sea del usuario autenticado
        if (post.id_usuario !== userId) {
            return res.status(403).send({message: "No autorizado para eliminar este post"});
        }
        const postDestroy = await Post.destroy({
            where: {id: postId}
        });
        if (postDestroy) {
            return res.status(200).send({ message: "Post eliminado exitosamente" });  
    }else{
        res.status(404).send({message: "Post no encontrado"});
    }
    } catch (error) {
        res.status(500).send({message: "error interno del servidor"});
    }}

//funcion para acceder a un post por id, de un usuario autenticado o de un usuario seguido
const getUserPost = async (req, res) => {
    try {
        const userId = req.user.id; //guardamos el id del usuario autenticado desde le middleware
        const postId = req.params.id; //guardamos el id del post desde el cuerpo de la solicitud

        //busca el post con su autor por id
        const post = await Post.findByPk(postId, {
            include: [
                {
                    model: db.usuario,
                    attributes: ['id', 'nombre', 'nickname', 'mail'],
                }
            ],
        });

        //verifica si el post existe
        if (!post) {
            return res.status(404).send({ message: "Post no encontrado" });
        }

        //verifica si el autor del post es el usuario autenticado
        if (post.id_usuario === userId) {
            return res.status(200).send(post);
        }

        //verifica si el usuario sigue al autor del post
        const isFollowing = await Following.findOne({
            where: {
                id_usuario: userId,
                id_usuario_seguido: post.id_usuario,
            },
        });
        //verifica que el post que se intenta leer es de un usuario seguido
        if (!isFollowing) {
            return res.status(403).send({ message: "No tienes permiso para acceder a este post" });
        }

        return res.status(200).send(post);
    } catch (error) {
        console.error(error);
        res.status(500).send({ 
            message: "Error interno del servidor", 
            error: error.message 
        });
    }
};

//funcion para listar los posts de un usuario determinado (solo si se sigue a determinado usuario)
const getPostFrom = async (req, res) => {
    try {
        const userId = req.user.id; //extrae el ID del usuario autenticado
        const userIdPosts = req.params.id; //el ID del usuario del cual se quieren obtener los posts
        
        //comprueba que exista una relación de seguimiento desde el usuario que intenta acceder hacia el autor de los posts
        const isFollowing = await Following.findOne({
            where: {
                id_usuario: userId,
                id_usuario_seguido: userIdPosts,
            },
        });
        //si no existe una relacion de seguimiento
        if (!isFollowing && userId !== parseInt(userIdPosts)) {
            return res.status(403).send({ message: "No tienes permiso para acceder a este post" });
        }
        //busca todos los post del autor
        const posts = await Post.findAll({
            where: { id_usuario: userIdPosts }, //filtra por el ID del usuario al que queremos acceder
            include: {
                model: db.usuario,
                attributes: ["id", "nombre", "nickname", "mail"], //incluye datos básicos del usuario
            },
        });
        //si el usuario no tiene posts devuelve error 404 Not Found
        if (posts.length === 0) { 
            return res.status(404).send({ message: "El usuario no tiene posts" });
        }

        return res.status(200).send(posts);
    }
     catch (error) {
        res.status(500).send({message: "Error interno del servidor"});
    }
}

module.exports = {
    home,
    createPost,
    getPosts,
    updatePost,
    deletePost,
    getUserPost,
    getPostFrom
}