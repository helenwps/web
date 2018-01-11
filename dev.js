/**
 * 开发环境配置
 * @Author suyg1103@13322.com
 */
var webpack = require("webpack");
var opn = require('opn');
var path = require('path');
var express = require('express');

var port = 9527;
var uri = 'http://localhost:'+port;
var app = express()

var webpackConfig = require('./webpack.dev.js');
Object.keys(webpackConfig.entry).forEach(function (name) {
  webpackConfig.entry[name] = ['./dev-client'].concat(webpackConfig.entry[name])
})
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: '/',
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler,{
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})
app.use(require('connect-history-api-fallback')())
app.use(devMiddleware)
app.use(hotMiddleware)

var staticDir = path.posix.join('./','src/web');
app.use(express.static(staticDir))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at ' + uri + '\n')
  opn(uri)
})