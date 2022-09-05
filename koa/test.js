const obj = {
  a: 1
}

const foo = Object.create(obj)

foo.__proto__.a = 123

console.log(foo.__proto__)
