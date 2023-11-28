import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/ticket/'); // Directorio donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, ``);
    },
  });
  
  export const upload = multer({ storage });