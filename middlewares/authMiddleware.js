const jwt = require("jsonwebtoken");//importamos el token

const auth = (req, res, next) => { //toma next para ejecutar la proxima función
    const token = req.header("Authorization");
    //verifica si el token existe
    if (!token) {
        return res.status(401).send({ message: "No hay token" });
    }

    try {
        //decodifica el token
        const verified = jwt.verify(token, process.env.JWT_SECRET); //usa la funcion de jwt para verificar el token
        req.user = verified; //agregar la información del usuario al objeto `req`
        next(); // Pasar al siguiente middleware o controlador
    } catch (error) {
        res.status(400).send({ 
            message: "Token no válido",
            details: error.message 
        });
    }
};

module.exports = auth;