import Gateway from 'fast-gateway'
import {Protocol, Service, Server} from 'restana'
import routes from './routes'
import Middleware from './middleware'
// 初始化gateway
export default (Server: Service<Protocol>): Service<Protocol.HTTP2> =>
  Gateway<Protocol.HTTP2>({
    // 使用restana作为server
    server: Server,
    middlewares: [Middleware.httpLogger],
    routes,
  })
