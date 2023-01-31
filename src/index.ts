import Service from '../lib/baseServer/http2Server'
import GateWay from './gateway'
import Config from '../config'
import logger from '../lib/logger'

logger.info('Current NODE_ENV is ' + Config.env)

// 注册网关
const HttpGateway = GateWay(Service)

Service.start(Config.port).then(() => {
  logger.info(`GateWay worker start on ${Config.port}`)
})

process.on('uncaughtExceptionMonitor', error => {
  logger.fatal(error, 'Got an unhandle error, check the code')
  Service.close()
  process.exit()
})
