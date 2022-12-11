import multer from 'multer'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })
export default upload.single('image')
