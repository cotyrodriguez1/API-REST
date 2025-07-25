//se crea el modelo para los posts, con dos parametros, uno el objeto de conexion y otro para configurar Sequelize
const Post = (sequelize, Sequelize) => {
    return sequelize.define("Post", {
        id_usuario: {  //el post tendrá un campo que será el id del usuario que lo creó
            type: Sequelize.INTEGER, //el tipo del campo
            allowNull: false, //indica que no puede estar vacío
            references: {
                model: 'Usuarios', //indica que el contenido esta en la tabla Usuarios:
                key: 'id', //especificamente la clave primaria del modelo usuario
            },
            onUpdate: 'CASCADE', // Actualiza en cascada si cambia el id del usuario
            onDelete: 'CASCADE', // Elimina los posts si se elimina el usuario
        },
        titulo: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        contenido: {
            type: Sequelize.TEXT,
            allowNull: false
        },
    },{
        timestamps: false
    });
};

module.exports = Post;