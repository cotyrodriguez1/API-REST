const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const upload = require("../middlewares/uploadMiddleware");

const Sequelize = require("sequelize");
const parameters = require("../config/config");
const sequelize = new Sequelize(
  parameters.database,
  parameters.username,
  parameters.password,
  {
    host: parameters.host,
    dialect: parameters.dialect
  }
);
const UsuarioModel = require("../models/usuario");
const Usuario = UsuarioModel(sequelize, Sequelize);

// Registro
router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.avatar = req.file.path;
    }
    const user = await Usuario.create(data);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { mail, password } = req.body;
  const user = await Usuario.findOne({ where: { mail } });
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user.id }, "1234");
  res.json({ token });
});

module.exports = router;
