const url = require('url')

const request = {
  // 这就是为什么在 request 身上加一个 req 属性，为了在取值的时候快速获取到原生的 req
  get url() {
    return this.req.url
  },
  get path() {
    const { pathname } = url.parse(this.req.url)
    return pathname
  },
  get query() {
    const { query } = url.parse(this.req.url, true)
    return query
  }
}

module.exports = request
