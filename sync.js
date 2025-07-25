const db = require("./models"); //importamos los modelos

//sincroniza y crea las tablas especificadas en el modelo
db.sequelize.sync({force: false}) //force: true lo que hace es resetear los registros de las tablas en la base de datos cada vez que se ejecute el script
    .then(()=>{
        console.log("Sincronización exitosa!!!");
    })
    .catch((error) => {
        console.error("Falló la sincro", error);
    })

    