import { Schema, model, Model } from 'mongoose'
const { ObjectId } = Schema.Types
import { z } from 'zod'

export interface IGame {
  white: string
  black: string
  winner?: 'white' | 'black'
  fen?: string
  pgn?: string
  status?: 'active' | 'finished'
  endReason?: 'checkmate' | 'resign' | 'draw' | 'timeout'
  // timeControl: 'bullet' | 'blitz' | 'rapid' | 'classical'
  // time: number
  // increment: number
  // rated: boolean
}

export const gameSchema = new Schema(
  {
    white: { type: ObjectId, ref: 'User' },
    black: { type: ObjectId, ref: 'User' },
    winner: { type: String, enum: ['white', 'black'] },
    fen: String,
    pgn: String,
    status: { type: String, enum: ['active', 'finished'] },
    endReason: {
      type: String,
      enum: ['checkmate', 'resign', 'draw', 'timeout'],
    },
    timeControl: {
      type: String,
      enum: ['bullet', 'blitz', 'rapid', 'classical'],
    },
    time: { type: Number, default: 0 },
    increment: { type: Number, default: 0 },
    rated: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default model('Game', gameSchema)
