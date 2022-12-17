// !! packages not in package.json !!
// use with ES imports
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const region = process.env.AWS_BUCKET_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

// https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
export const getObjSignedUrl = async (key: string) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  }
  const command = new GetObjectCommand(params)
  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  return url
}

export const uploadFile = (fileBuffer: Buffer, fileName: string, mimetype: string) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  }

  return s3Client.send(new PutObjectCommand(uploadParams))
}

export const deleteFile = (fileName: string) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  }

  return s3Client.send(new DeleteObjectCommand(deleteParams))
}
