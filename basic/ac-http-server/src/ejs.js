const ejs = require('ejs')
const path = require('path')
const fs = require('fs')

const filePath = path.resolve(__dirname, 'template.html')

// ejs.renderFile(
//   path.resolve(__dirname, 'template.html'),
//   { dirs: [1, 2, 3] },
//   (err, data) => {
//     console.log(err)
//     console.log(data)
//   }
// )

function renderFile(filePath, data, cb) {
  let templateStr = fs.readFileSync(filePath, 'utf-8')

  let head = 'let str = ``;\r\nwith(obj){'

  head += 'str +=`'
  templateStr = templateStr.replace(/<%=(.+?)%>/g, function () {
    console.log('arguments >>> ', arguments)
    return '${' + arguments[1] + '}'
  })
  head += templateStr.replace(/<%(.+?)%>/g, function () {
    return '`\r\n' + arguments[1] + '\r\nstr+=`'
  })
  head += '`\r\n}\r\nreturn str'
  const fn = new Function('obj', head)
  let ret = fn(data)
  console.log('ret >>> ', ret)
  return cb(null, ret)
}

// 模板引擎实现原理
// 1. new Function
// 2. with(){}

renderFile(filePath, { dirs: [1, 2] }, () => {})
