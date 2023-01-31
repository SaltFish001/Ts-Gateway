import http2 from 'node:http2'
import restana, {Protocol} from 'restana'
import hostnamesHook from 'fast-gateway/lib/hostnames-hook'
import config from '../../config'
import SNICallback from './middleware/sniCallback'

const Server = http2.createSecureServer(
  {
    SNICallback,
    allowHTTP1: true,
  },
  (req, res) => {
    // 校验是否包含Host头或:authority
    if (!req.headers.host && req.headers[':authority']) {
      req.headers.host = req.headers[':authority']
    }
    // 注册hostnames2prefix
    hostnamesHook(config.hostnames2prefix)(req, res, (): void => null)
  },
)
// 创建Restana on http2Server作为后续服务的基础service
const Service = restana<Protocol>({
  server: Server,
})

export default Service
