import { Schema, model, Types, Model } from 'mongoose'
const { ObjectId } = Types
import { z } from 'zod'

export interface IContact extends BaseModel {
  name: string
  age?: number
}

interface IContactMethods {}

type ContactDoc = Model<IContact, {}, IContactMethods>

const contactSchema = new Schema<IContact, ContactDoc, IContactMethods>(
  {
    name: { type: String, required: true },
    age: Number,
  },
  { timestamps: true }
)

export default model<IContact, ContactDoc>('Contact', contactSchema)

export const contactBody = z.object({
  name: z.string().min(3).max(255),
  age: z.number().optional(),
})
