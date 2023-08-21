import * as dotenv from 'dotenv'

const r = dotenv.config()
if (r.error) {
  dotenv.config({ path: '.env.default' })
}
