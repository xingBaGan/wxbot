const local = {
  port: 3000,
  host: 'localhost',
  mongoUrl: 'mongodb+srv://root:Hew5ivqwGmlkLaLU@cluster0.t7utd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  secret: '123456',
  // tianApiKey:'00a1785cc6e674e458e88588b74fec86'
}
const development = {
  port: 8081,
  secret: '123456',
  mongoUrl: 'mongodb+srv://root:Hew5ivqwGmlkLaLU@cluster0.t7utd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  tianApiKey:'00a1785cc6e674e458e88588b74fec86'
}
const production = {
  port: 8081,
  secret: '123456',
  mongoUrl:'mongodb+srv://root:ikwL5R2tY05lHSvV@cluster0.t7utd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
}
let config = Object.assign(local, development)
if (process.env.NODE_ENV == 'production') {
  config = Object.assign(local, production)
}
module.exports = config
