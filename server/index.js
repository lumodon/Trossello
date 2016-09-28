import '../../config/environment'
import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import errorHandlers from './error_handlers'
import authRoutes from './auth_routes'
import apiUsersRouter from './api/users'
import apiBoardsRouter from './api/boards'
import apiListsRouter from './api/lists'
import apiCardsRouter from './api/cards'

const appRoot = process.env.APP_ROOT
const buildPath = process.env.BUILD_PATH
const server = express()

module.exports = server

server.set('env', process.env.NODE_ENV)
server.set('port', process.env.PORT || '3000')
if (process.env.NODE_ENV !== 'test') server.use(logger('dev'))
server.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_KEY]
}))
server.use(express.static(buildPath+'/public'))
server.use(bodyParser.json())

server.use('/', authRoutes);
server.use('/api/users',  apiUsersRouter)
server.use('/api/cards',  apiCardsRouter)
server.use('/api/boards', apiBoardsRouter)
server.use('/api/lists',  apiListsRouter)

server.get('/*', (request, response) => {
  response.sendFile(buildPath+'/public/index.html')
});

server.use(errorHandlers)

if (process.env.NODE_ENV !== 'test'){
  server.listen(server.get('port'))
}
