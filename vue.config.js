// 一般默认文件里是没有这个css配置的, 添加进去就好.
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'), // This line must in sass option
      },
    },
  }
}
