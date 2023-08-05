import { RequestHandler } from 'express'
import Contact from '../models/contact.model'


export const listContacts: RequestHandler = (req, res) => {
  res.send('LIST contact')
}

export const createContact: RequestHandler = (req, res) => {
  res.send('POST contact')
}

export const getContact: RequestHandler = (req, res) => {
  res.send('GET contact')
}

export const updateContact: RequestHandler = (req, res) => {
  res.send('PUT contact')
}

export const deleteContact: RequestHandler = (req, res) => {
  res.send('DELETE contact')
}
