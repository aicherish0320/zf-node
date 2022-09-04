// node 中专门用来加密、摘要算法的
const crypto = require('crypto')

// md5 是一种摘要算法（不是加密 加密算法是能解密）

const r = crypto.createHash('md5').update('hello').digest('base64')
console.log('r >>> ', r)

// 1. 相同的内容摘要的结果是相同的
// 2. 如果摘要的内容有一点点变化，会导致输出的结果完全不同，雪崩效应
// 3. 不同的内容，摘要的结果长度是一致的

// 给内容生成一个指纹 作为标识
