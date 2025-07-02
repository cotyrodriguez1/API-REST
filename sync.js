const Sequelize = require("sequelize");
const parameters = require("./config/config");
const UsuarioModel = require("./models/usuario");

const sequelize = new Sequelize(
  parameters.database,
  parameters.username,
  parameters.password,
  {
    host: parameters.host,
    dialect: parameters.dialect
  }
);

const Usuario = UsuarioModel(sequelize, Sequelize);

sequelize.sync({ force: true })
  .then(() => {
    console.log("Sincronización exitosa!!!!");
  })
  .catch((error) => {
    console.error("Fallo la sincronización", error);
  });
