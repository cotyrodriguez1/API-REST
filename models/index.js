const {Sequelize} = require("sequelize"); //extrae las funciones de Sequelize para configurar la base de datos
const parameters = require("../config/config");//guarda los parametros de la configuración

//crea el objeto de conexión con la base de datos, pasandole los parametros creados en el archvo config.js
const sequelize = new Sequelize(
    parameters.database,  
    parameters.username,
    parameters.password,
    {
        host: parameters.host,
        dialect: parameters.dialect,
    }
);

const db = {}; //crea la base de datos

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuario = require("./usuario")(sequelize, Sequelize); //carga el modelo usuario
db.Post = require("./post")(sequelize, Sequelize); //carga el modelo post
db.Following = require("./following")(sequelize, Sequelize);//carga el modelo following

// Relaciones entre modelo Usuario y Post
db.usuario.hasMany(db.Post, { foreignKey: 'id_usuario'}); //indica que un usuario puede tener muchos posts
db.Post.belongsTo(db.usuario, { foreignKey: 'id_usuario',}); //indica que muchos posts pueden pertenecer solo a un usuario

// Relacion de SEGUIDOS:
db.usuario.belongsToMany(db.usuario, { //un usuario puede seguir a muchos otros usuarios, y cada usuario puede ser seguido por varios otros
    through: db.Following, //indica que esta relación se establece mediante la tabla intermedia Following
    as: 'seguidos', //alias para acceder a los usuarios que este usuario sigue
    foreignKey: 'id_usuario', //referencia al usuario que está siguiendo a otros
    otherKey: 'id_usuario_seguido' //referencia a los usuarios que son seguidos
});
// Relacion de SEGUIDORES:
db.usuario.belongsToMany(db.usuario, {
    through: db.Following, //indica que esta relación se establece mediante la tabla intermedia Following
    as: 'seguidores', //alias para acceder a los usuarios que siguen a este usuario
    foreignKey: 'id_usuario_seguido', // Referencia al usuario que es seguido
    otherKey: 'id_usuario' // Referencia al usuario que está siguiendo
});



module.exports = db;//exportamos la base de datos