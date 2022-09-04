module.exports = {
  port: {
    flags: '-p, --port <val>',
    description: 'Port to use [3331]',
    default: 3331,
    usage: 'ac-http-server --port 3331'
  },
  directory: {
    flags: '-d, --directory <val>',
    description: 'directory to use cwd',
    default: process.cwd(),
    usage: 'ac-http-server --directory d:'
  }
}
