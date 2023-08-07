import { app } from '../../framework/app'
import { auth } from '../../middleware'
import Contact, { contactBody } from '../../models/contact.model'

app.route('/contacts', {
  model: Contact,
  validator: contactBody,
  middleware: [auth],
})
