const bcrypt = require('bcryptjs');


 // se importa bcrypt, que es una librería para cifrar las contraseñas

//se crea una funcion para el usuario, con dos parametros, uno el objeto de conexion y otro para configurar Sequelize
const Usuario = (sequelize, Sequelize) => {
    return sequelize.define("Usuario",{   //primero define como se llamara el modelo, al cual al final le agrega una "s"
        //Aquí se configuran los campos que tendrá un usuario, nombre, mail, nickname, contraseña, avatar:
        nombre: {      
            type: Sequelize.STRING, //indica que el valor en la base de datos será de tipo string
            allowNull: false,       //no permite que este dato se omita cuando se añade un registro
        },
        mail: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,      //indica que para cada registro, este valor tiene que ser único, no debe repetirse ni compartirse con otro registro
        },
        nickname: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        avatar: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    }, {
        //esto hace que se agreguen automáticamente los campos createdAt y updatedAt a la tabla:
        timestamps: true,
        //createdAt registra la fecha y hora en que se creó el registro.
        //updatedAt se actualiza automáticamente cada vez que se modifica el registro
        
        hooks: {
            //se ejecuta antes de que un nuevo usuario se guarde en la base de datos:
            beforeCreate: async(Usuario) => {
                if (Usuario.password) {   //verifica que el usuario tenga una contraseña
                    //se crea una "sal" (cadena aleatoria) que se agrega a la contraseña antes de encriptarla
                    const salt = await bcryptjs.genSalt(10);
                    //se encripta la contraseña, y se une con la sal generada  
                    Usuario.password = await bcryptjs.hash(Usuario.password, salt); //se asigna la contraseña encriptada al usuario
                }
            },
            //se ejecuta antes de actualizar un registro de usuario:
            beforeUpdate: async(Usuario) => {
                if (Usuario.changed("password")) { // Comprueba si el campo password ha cambiado
                    const salt = await bcryptjs.genSalt(10); // Si detecta un cambio, genera una nueva sal
                    Usuario.password = await bcryptjs.hash(Usuario.password, salt); //cifra la nueva contraseña y la asigna al usuario
                }
            },
        },
    })
}

module.exports = Usuario;