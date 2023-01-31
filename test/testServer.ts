import restana, {Protocol} from 'restana'
import ws from 'ws'
import logger from '../lib/logger'
// const Server = http.createServer()
const testServer = restana<Protocol.HTTP>({})

testServer.all('/', (req, res) => {
  res.send(
    {
      message: 'success',
    },
    200,
  )
})
const Server = testServer.getServer()
const testWsServer = new ws.Server({
  server: Server,
  path: '/wss-path-for-hw/locals',
})

testWsServer.on('connection', (socket, request) => {
  // const {headers} = request
  // logger.info('headers >>>', headers)
  socket.on('close', (code, reason) => {
    logger.info(`Client exit with code: ${code} ${reason}`)
  })
  socket.on('message', data => {
    logger.info('received: %s', data)
    socket.send('pong')
  })
})

Server.listen(8000)
