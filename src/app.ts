import swagger from 'swagger-ui-express'
import yaml from 'js-yaml'
import fs from 'fs'

import { NodeEnv, NODE_ENV } from './config/consts'
import { app } from './framework'
import './routes'

app.route('/ping')

if (NODE_ENV === NodeEnv.DEV) {
  const docs = yaml.load(
    fs.readFileSync(__dirname + '/docs.yaml', 'utf8')
  ) as any

  app.useRouter('/docs', (r) => {
    r.use('/', swagger.serve)
    r.get('/', swagger.setup(docs))
    return r
  })
}

export default app.init()
