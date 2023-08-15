import { Chess, Move } from 'chess.js'

const game = new Chess()

interface History {
  moves: Move[]
  move: number
  current: Move
  push: (move: Move) => void
  prev: () => void
  next: () => void
}

const history: History = {
  moves: [],
  move: 0,
  get current() {
    return this.moves[this.move - 1]
  },
  push(move) {
    this.moves.push(move)
    this.move++
  },
  prev() {
    if (this.move > 0) {
      this.move--
      game.undo()
    }
  },
  next() {
    if (this.move < this.moves.length) {
      game.move(this.moves[this.move])
      this.move++
    }
  },
}

history.push(game.move('e4'))
history.push(game.move('e5'))
history.push(game.move('f4'))
history.push(game.move('exf4'))

// console.log('INIT', game.history({ verbose: true }))

game.undo()

// console.log('UNDO', game.history({ verbose: true }))

// console.log('HISTORY', history.moves)

console.log(history.current)

history.prev()

console.log(history.current)

console.log(game.ascii())
