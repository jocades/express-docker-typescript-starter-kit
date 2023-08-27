import swagger from 'swagger-ui-express'
import docs from './docs.json'

import { app } from './framework'
import './routes'

app.route('/ping')

app.useRouter('/docs', (r) => {
  r.use('/', swagger.serve)
  r.get('/', swagger.setup(docs))
  return r
})

export default app.init()
