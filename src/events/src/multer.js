const multer=require('multer');
const path=require('path');
const multerStorage=multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,path.join(__dirname,'../../../public/'))
  },
  filename: (req, file, cb) => {
    const fileName=`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(
      null,fileName
    )
    }
});

const multerFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
};

const upload = multer({
  storage:    multerStorage,
  fileFilter: multerFilter,
  limits: {
      fileSize: 1024 * 1024 * 10
    }
});

module.exports = {upload}
