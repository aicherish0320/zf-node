function EventEmitter() {
  this._events = {}
}

// 订阅
EventEmitter.prototype.on = function (eventName, callback) {
  if (!this._events) this._events = Object.create(null)

  let eventCallbacks = this._events[eventName] || (this._events[eventName] = [])

  if (eventName !== 'newListener') {
    this.emit('newListener', eventName)
  }

  eventCallbacks.push(callback)
}
EventEmitter.prototype.once = function (eventName, callback) {
  const once = (...args) => {
    callback(...args)
    this.off(eventName, once)
  }
  once.l = callback
  this.on(eventName, once)
}
// 触发
EventEmitter.prototype.emit = function (eventName, ...args) {
  if (!this._events) this._events = Object.create(null)

  let eventCallbacks = this._events[eventName]
  eventCallbacks && eventCallbacks.forEach((cb) => cb(...args))
}
// 移除
EventEmitter.prototype.off = function (eventName, callback) {
  if (!this._events) this._events = Object.create(null)

  const eventCallbacks = this._events[eventName]
  if (eventCallbacks) {
    // 使用 filter
    this._events[eventName] = this._events[eventName].filter(
      (item) => item !== callback && item.l !== callback
    )
  }
}

module.exports = EventEmitter
