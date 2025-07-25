const multer = require('multer');
const path = require('path');

//configuracion del almacenamiento con multer
const storage = multer.diskStorage({
    //toma la solicitud, el archivo y una función callback
    destination: function(req, file, cb) {
        cb(null, 'uploads/avatars');// carpeta donde se guardan las imagenes
    },
    //crea la estructura para el nombre del archivo
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); //crea un sufijo compuesto por la fecha de hoy y un número aleatorio
        const ext = path.extname(file.originalname); //obtiene la extencion del archivo
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); //determina el nombre con el sufijo mas la extencion
    }
})

//filtrar archivos para que solo se suban imagenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/; //con una expresion regular define los tipos de archivos permitidos
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase()); //test para verificar que las extenciones sean las permitidas
    const mimetype = allowedTypes.test(file.mimetype);//valida la información del archivo para aseguirar que sea una imagen

    if (mimetype && extname) {//si el archivo pasa las validaciones
        return cb(null, true);//retorna true (el primer argumento es para manejar errores)
    } else {//si no pasa las validaciones indicamos que solo se admiten los tipos esperados
        cb(new Error('Solo se permiten imágenes en formato JPEG, JPG, PNG o GIF'));
    }
};
//funcion para la subida de archivos
const upload = multer({
    storage: storage, //indicamos el almacenamiento programado
    fileFilter: fileFilter, //indicamos el filtro programado
    limits: { fileSize: 20 * 1024 * 1024 } // Límite de 2MB por imagen
});

module.exports = upload;