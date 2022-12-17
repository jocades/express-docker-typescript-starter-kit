import { spawn } from 'child_process'

const python = (file: string, args: Array<any>) => {
  // path starts
  const script = spawn('python', [`${file}`, ...args])

  script.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  script.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })

  script.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}

export default python

// Example usage:
// $ ts-node src/utils/python.ts
// python('utils/example.py', [2, 3]) // => 5

// how to call it with __filename
// python(__filename, [2, 3]) // => 5
