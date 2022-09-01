// node 是基于事件驱动的方式（内置了发布订阅）
const EventEmitter = require('events')
const util = require('util')
// on 绑定事件 off 解绑事件 emit 发射事件 once 绑定一次事件

function Girl() {}
// Girl.prototype.__proto__ = EventEmitter.prototype
// Girl.prototype = Object.create(EventEmitter.prototype)
// Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype)
// 原型基础，node 中内部代码实现原型继承
util.inherits(Girl, EventEmitter)
const events = new Girl()
// 只要绑定了事件就会触发回调方法
let pending = false
// newListener: 可以监听新绑定的事件
events.on('newListener', (eventName) => {
  // console.log('eventName >>> ', eventName)
  if (!pending && eventName === 'a') {
    process.nextTick(() => {
      events.emit(eventName)
      pending = false
    })
    pending = true
  }
})

const handler1 = (m) => {
  console.log('a', m)
}
const handler2 = (m) => {
  console.log('b', m)
}
const handler3 = (m) => {
  console.log('c', m)
}

events.on('a', handler1)
// events.off('a', handler1)
// events.once('a', handler1)
// events.emit('a', 'money')
events.on('a', handler2)
events.on('a', handler3)

// events.emit('a', 'no money')

// 我们希望能主动的监控用户绑定了什么事件
