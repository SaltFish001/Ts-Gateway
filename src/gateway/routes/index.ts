import {Route, WebSocketRoute} from 'fast-gateway'
import Config from '../../../config'

const routes: (Route | WebSocketRoute)[] = []

const {gatewayRoutes} = Config
for (const key in gatewayRoutes) {
  if (Object.prototype.hasOwnProperty.call(gatewayRoutes, key)) {
    const element = gatewayRoutes[key]
    // 注册http gateway
    if (
      element.proxyType === 'http' &&
      !routes.find(val => {
        return val.prefix === element.prefix && val.proxyType === 'http'
      })
    ) {
      routes.push({
        proxyType: 'http',
        prefixRewrite: element.prefix,
        pathRegex: '(.*)',
        ...element,
      })
    }
    // 注册ws gateway
    if (
      element.proxyType === 'websocket' &&
      !routes.find(val => {
        return val.prefix === element.prefix && val.proxyType === 'websocket'
      })
    ) {
      routes.push({
        ...element,
      })
    }
  }
}

export default routes
