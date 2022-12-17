import crypto from 'crypto'

const algorithm = process.env.HASHING_ALGORITHM || 'aes-256-ctr'
const secretKey = crypto.randomBytes(32)

export const encrypt = (data: string): Hash => {
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()])

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  }
}

export const decrypt = (hash: Hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ])

  return decrpyted.toString()
}

export const generateFileName = (bytes = 8) => crypto.randomBytes(bytes).toString('hex')
