import swagger from 'swagger-ui-express'
import yaml from 'js-yaml'
import fs from 'fs'

import { app } from './framework'
// import './routes'

app.route('/ping')

const docs = yaml.load(fs.readFileSync(__dirname + '/docs.yaml', 'utf8')) as any

/* const spec = app.generateDocs()

app.useRouter('/docs', (r) => {
  r.use('/', swagger.serve)
  r.get(
    '/',
    swagger.setup(spec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Docs',
      customfavIcon: 'src/public/favicon.ico',
    })
  )
  return r
}) */

export default app.init()
