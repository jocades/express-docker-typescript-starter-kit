import * as dotenv from 'dotenv'

const result = dotenv.config()
if (result.error) dotenv.config({ path: '.env.default' })
