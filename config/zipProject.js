let zipper = require("zip-local")
let sourcePath = require('path').resolve(__dirname, '../dist')
let destPath = require('path').resolve(__dirname, '../build_zip')

let zipVersion = process.argv.splice(2)[0]

console.log('------------执行打包压缩--------------');
  setTimeout(() => {
    zipper.sync
      .zip(sourcePath)
      .compress()
      .save(destPath + `/${zipVersion}.zip`);
      console.log('------------执行打包压缩完成--------------');
  }, 1000);