console.log(1)

async function async() {
  console.log(2)
  // await 马上执行
  await console.log(3) // Promise.resolve(console.log(3)).then(() => {console.log(4)})
  console.log(4)
}

setTimeout(() => {
  console.log(5)
}, 0)

const promise = new Promise((resolve, reject) => {
  console.log(6)
  resolve(7)
})

promise.then((res) => {
  console.log(res)
})

// async 执行 就是让这个函数立即执行
async()
console.log(8)

// async/await 本质上就是 promise
