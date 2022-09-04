#!/usr/bin/env node

const { program } = require('commander')
const config = require('../bin/config')
const pkg = require('../package.json')
const Server = require('../src/main')

const usages = []
Object.values(config).forEach((option) => {
  program.option(option.flags, option.description, option.default)
  usages.push(option.usage)
})

program.name('ac-http-server')
program.usage('[options]')
program.version(pkg.version)

program.on('--help', () => {
  console.log('\r\nExamples: ')
  usages.forEach((u) => {
    console.log(`  ${u}`)
  })
})

// 解析用户的所有参数
program.parse(process.argv)

const opts = program.opts()
// 通过用户选项 去启东一个静态服务
new Server(opts).start()
