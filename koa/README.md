# Cookie Session LocalStorage SessionStorage

- LocalStorage SessionStorage 都是本地存储，都不支持跨域，存储大小 5M，如果存储数据过大，浏览器中的数据库 indexDB；SessionStorage 浏览器关闭后就会销毁，LocalStorage 如果不销毁会一直存在
- Cookie 的特点，http 默认是无状态的，每次请求不知道是谁来了，每次请求都会默认携带（并不是所有内容都放在 cookie 中）,浪费流量，如果 cookie 内容过大会导致页面白屏，cookie 大小是 4k；数据如果有一些隐私，不安全。
- Session 基于 cookie 的但是更加安全，存放一些私密的内容。存在服务端中
