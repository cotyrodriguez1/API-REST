const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const usuarioRouter = require("./routes/usuarioRoutes");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/usuarios", usuarioRouter);

app.listen(PORT, () => {
  console.log(`Aplicacion corriendo en puerto ${PORT}`);
});
