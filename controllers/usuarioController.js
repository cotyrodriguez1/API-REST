const db = require("../models"); //importamos los archivos del modelo
const Usuario = db.usuario // se crea el objeto usuario para tener acceso al modelo del ORM para interactuar con la base de datos
const bcrypt = require('bcryptjs');
//importa el bcrypt para encriptar 
const jwt = require("jsonwebtoken");//importa le generador de token

//funcion para la ruta principal de usuario
const home = (req, res) =>{
    res.status(200).send("ruta principal de usuario");
};


//funcion para listar todos los usuarios registrados en la base de datos, por paginación
const list = async (req, res) => {  //async indica que la función devuelve una promesa, ya que requiere de una interacción con la base de datos
    try {
        const page = parseInt(req.query.page) || 1; //número de página, lo toma de request y por defecto es 1
        const limit = parseInt(req.query.limit) || 10; //establece que el límite de registro por pagina será de 2

        if (page < 1 || limit < 1){ //agregamos una validación para que la página y el límite sean valores positivos
            return res.status(400).send({message: "La página y el límite deben ser valores positivos"})
        }

        //calculamos el desplazamiento en cada página, restando 1 a la página actual y multiplicandolo por el límite:
        const offset = (page - 1) * limit;

        const {count, rows} = await Usuario.findAndCountAll({ //guardamos el conteo de los registros y los registros en si
            attributes: {exclude: ['password']},//excluimos la contraseña en la lista que guarda los usuarios
            limit: limit, //indicamos que el límite tiene que ser el que establecimos
            offset: offset//indicamos que el desplazamiento sea el que calculamos 
        }); 

        //enviamos la respuesta con los registros:
        res.status(200).send({
            totalItems: count, //la cantidad total de items o usuarios
            totalPages: Math.ceil(count/limit),//la cantidad total de páginas
            currentPage: page, //la página actual
            itemsPerPage: limit, //la cantidad de usuarios que se presentan por página
            data: rows //los registros
        })

    } catch (error) {
        res.status(500).send(error.message);
    }
}
//funcion para crear un usuario
const register = async (req, res) => {
    try {
        const {nombre, nickname, mail, password} = req.body; //extrae y guarda los datos del body
    
        if (!nombre || !nickname || !mail || !password) {    //se validan los datos ingresados:
            return res.status(400).send({ message: "Todos los campos son obligatorios" });
        }

        //se crea el usuario
        const usuario = await Usuario.create({nombre, nickname, mail, password});
        res.status(201).send(usuario); //devuelve el usuario como respuesta exitosa
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError"){
            res.status(400).send({message: "Mail o nickname ya existente"});
        }else{
        res.status(500).send( {message: error.message, nombre: error.name});
        }
    }
}

//funcion para loguear a un usuario
const login = async (req, res) => {
    const { mail, password } = req.body; //almacena el mail y la contraseña del body    

    try {

        if (!mail || !password) {
            return res.status(400).send({message: "Debe proporcionar mail y contraseña"})
        }

        //verifica si existe un usuario con ese mail
        const usuario = await Usuario.findOne({ where: { mail } });//intenta buscar el usuario con el mismo mail en la base de datos
        if (!usuario) { //si el usuario no fue encontrado devuelve error 404:
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        //compara la contraseña pasada en el body y la del usuario en la bd con bcrypt
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) { //si no coincide responde con error de solicitud 400
            return res.status(400).send({ message: "Contraseña incorrecta" });
        }
        //crea un token con la clave secreta
        const token = jwt.sign({
            //añade los datos del usuario en el head del token:
            id: usuario.id,
            nombre: usuario.nombre,
            mail: usuario.mail
        }, process.env.JWT_SECRET, { expiresIn: 180 }); //añade la clave secreta y la expiración

        //responde con el token:
        res.status(200).send({ 
            message: "Inicio de sesión exitoso",
            token 
        });
        //error interno del servidor
    } catch (error) {
        res.status(500).send({
            message: "Error en el servidor",
            error: error.message
        });
    }
};

//funcion para encontrar un usuario por id
const findById = async(req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id); //se pasa a la funcion del ORM el id en los parametros del req
        if (usuario){
            res.status(200).send(usuario); //si el usuario fue encontrado, respuesta 200 OK
        }else{
            res.status(404).send({message: "Not found"}); //de no existir usuario con ese id, respuesta 404 Not Found
        }
    } catch (error) {
        res.status(500).send({message: "Error interno del servidor"});//si el try falla, error del servidor
    }
}


//funcion para editar un usuario (requiere autenticación)
const update = async(req, res) => {
    try {
        //obtiene los datos del usuario autenticado desde el middleware
        const userId = req.user.id;
        //los datos a actualizar se envian en el body de la solicitud
        const { nombre, nickname, mail, password } = req.body;
        let avatarPath = null;
        if (req.file) {
            avatarPath = `uploads/avatars/${req.file.filename}`
        }

        //busca el usuario por su id
        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {//si no se encuentra manda error 404 Not Found
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        //actualiza los campos con lo enviado en el body, en caso no no haber proporcionado algún dato, se queda con el anterior
        usuario.nombre = nombre || usuario.nombre;
        usuario.nickname = nickname || usuario.nickname;
        usuario.mail = mail || usuario.mail;
        if (avatarPath) {
            usuario.avatar = avatarPath; // Guardar la ruta del avatar
        }

        //solo actualiza la contraseña si fue proporcionada
        if (password) {
            usuario.password = password;
        }

        await usuario.save(); //Sequelize activará el hook `beforeUpdate` si es necesario
        
        res.status(200).send(usuario);//envía el usuario como respuesta 200 
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


//exportamos las funciones del controlador, para poder crear los endpoints en las rutas:
module.exports = {
    home,
    list,
    register,
    findById,
    update,
    login
}