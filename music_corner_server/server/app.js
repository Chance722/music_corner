const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')

//添加jwt
const jwt = require('koa-jwt')
const secret = 'jwt-secret-722'

const ApiError = require('./app/error/ApiError')
const ApiErrorNames = require('./app/error/ApiErrorNames')


//api路由
const api = require('./routes/index')
//响应返回格式化中间件
const response_formatter = require('./middlewares/response_formatter')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(response_formatter('^/api'))
app.use(cors())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(api.routes(), api.allowedMethods())



//jwt 数组中的路径不需要通过jwt验证
app.use(jwt({secret}).unless({
	path: [/^\/api\/admin\/login/,/^\/api\/admin\/regist/]
}))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
