#!/usr/bin/env node

// 主入口文件，用于支持直接导入
module.exports = {
  version: require('./package.json').version,
  cli: require('./bin/cli.js')
};