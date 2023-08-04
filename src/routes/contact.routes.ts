import { Request, RequestHandler, Response, Router } from "express";
import * as z from 'zod'
import { AnyZodObject } from "zod";

const router = Router()

const contacts = [
  {
    name: 'John',
    age: 20,
  },
  {
    name: 'Jane',
    age: 30,
  },
]

const contactSchema = z.object({
  name: z.string().min(3).max(255),
  age: z.number().min(18).max(100),
})

type Contact = z.infer<typeof contactSchema>

router.get('/', (req, res) => {
  return res.json(contacts)
})

type Validate = (schema: AnyZodObject) => RequestHandler

const validate: Validate = (schema) => {
  return async (req, res, next) => {
    const result = await schema.safeParseAsync(req.body)
    if (!result.success) {
      return res.status(400).json(result.error)
    }
    req.body = result.data
    next()
  }
}

type ReqHandler = RequestHandler<{}, {}, Contact>

const addContact: ReqHandler = (req, res) => {
  const contact = req.body
  console.log(contact)

  contacts.push(contact)
  return res.status(201).json(contact)
}

router.post('/', validate(contactSchema), addContact)

export default router
