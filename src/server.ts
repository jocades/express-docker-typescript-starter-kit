import app from './start/app'
import { log } from './utils/debug'

const port = process.env.PORT || 8000

app.listen(port, () => log(`Listening on http://localhost:${port}`))
