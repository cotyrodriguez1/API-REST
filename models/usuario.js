const bcrypt = require("bcrypt");

const Usuario = (sequelize, Sequelize) => {
  const User = sequelize.define("Usuario", {
    nombre: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mail: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
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
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    }
  });
  return User;
};

module.exports = Usuario;
