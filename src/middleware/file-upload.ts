import multer from 'multer'

// Memory storage to upload to AWS S3 bucket
const storage = multer.memoryStorage()
const upload = multer({ storage })

const image = upload.single('image')
const images = upload.array('images')

export default {
  image,
  images,
}
