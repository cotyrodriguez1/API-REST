const Following = (sequelize, Sequelize) => {
    return sequelize.define('Following', {
        id_usuario: {
            type: Sequelize.INTEGER, //el ID del usuario de tipo entero
            allowNull: false, //no puede estar vacío
            references: {
                model: 'Usuarios', //nombre de la tabla a la que se hace referencia
                key: 'id', //clave primaria de la tabla Usuarios
            },
        },
        id_usuario_seguido: {
            type: Sequelize.INTEGER, //el ID del usuario seguido, de tipo entero
            allowNull: false,//no puede estar vacío
            references: {
                model: 'Usuarios', //nombre de la tabla a la que se hace referencia
                key: 'id', //clave primaria de la tabla Usuarios
            },
        },
    }, {
        timestamps: true, //para registrar en que momento se crearon o modificaron los registros

        //inidcamos que no se repita ningún seguimiento:
        indexes: [{
            unique: true, //restricción que indica que la clave principal de la tabla following sea la combinación de:
            fields: ['id_usuario', 'id_usuario_seguido'], //id de usuario y usuario seguido para evitar repeticiones
        }, ],
    });
};

module.exports = Following;