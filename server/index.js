const Koa = require('koa')
const path = require('path')
const consola = require('consola')
//导入nuxt 模块
const { Nuxt, Builder } = require('nuxt')
//将body 转为对象
const bodyParser = require('koa-bodyparser')
//jwt token 鉴权
const jwtKoa = require('koa-jwt')
const logger = require('./util/logger')

var port = 80 // 默认检测80端口
if (process.argv[2] === '-p') {
  port = parseInt(process.argv[3])
}
var net = require('net')

// 检测端口是否被占用
function portIsOccupied (port) {
  // 创建服务并监听该端口
  var server = net.createServer().listen(port)

  server.on('listening', function () { // 执行这块代码说明端口未被占用
    server.close() // 关闭服务
    console.log('The port【' + port + '】 is available.') // 控制台输出信息
  })

  server.on('error', function (err) {
    if (err.code === 'EADDRINUSE') { // 端口已经被使用
      console.log('The port【' + port + '】 is occupied, please change other port.')
    }
  })
}



//创建koa 实例
const app = new Koa()
const serve = require('koa-static');
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'
app.use(bodyParser({ extendTypes: ['json', 'text', 'form'] }))
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3001
  } = nuxt.options.server
  await nuxt.ready()
  const home = serve(path.join(__dirname)+'../dist/');
  app.use(home);
  app.use(require('./middleware/resformat')('^/api'))
  const api = require('./routes/api')
  app.use(api.routes(), api.allowedMethods())
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false
    ctx.req.ctx = ctx
    nuxt.render(ctx.req, ctx.res)
  })
  portIsOccupied(port)
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
//error
app.use(async (ctx, next) => {
  const startT = new Date()
  let ms
  try {
    await next().catch(err => {
      if (err.status === 401) {
        ctx.body = { errcode: 401, errmsg: 'Authentication' }
      } else { throw err }
    })
    ms = new Date() - startT;
  } catch (error) {
    console.log(error)
    ms = new Date() - startT
    logger.logError(ctx, error, ms)
  }
})
//设置需要鉴权的路由
app.use(jwtKoa({ secret: require('../config').secret }).unless({
  path: [
    /^\/api\/auth\/login/,
    /^\/api\/auth\/logout/,
    /^\/api\/robot\/login/,
    /^((?!\/api).)*$/
  ]
}));


//连接数据库
require('./config/db').connect()
const { baseLogPath, appenders } = require('./config/log4js')
const fs = require('fs');
const confirmPath = function (pathStr) {
  if (!fs.existsSync(pathStr)) fs.mkdirSync(pathStr)
}
start()
/**
 * init log
 */
 const initLogPath = function () {
  if (baseLogPath) {
    confirmPath(baseLogPath)
    for (var i = 0, len = appenders.length; i < len; i++) {
      if (appenders[i].path) {
        confirmPath(baseLogPath + appenders[i].path);
      }
    }
  }
}
initLogPath()
