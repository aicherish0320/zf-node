module.exports = {
  port: {
    flags: '-p, --port <val>',
    description: 'Port to use [3330]',
    default: 3330,
    usage: 'ac-http-server --port 3330'
  },
  directory: {
    flags: '-d, --directory <val>',
    description: 'directory to use cwd',
    default: process.cwd(),
    usage: 'ac-http-server --directory d:'
  }
}
