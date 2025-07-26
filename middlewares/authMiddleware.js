const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).send({ message: "No hay token" });
    }

    const token = authHeader.startsWith("Bearer")
        ? authHeader.replace("Bearer ", "").trim()
        : authHeader.trim();

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send({
            message: "Token no válido",
            info: error.message
        });
    }
};

module.exports = auth;
