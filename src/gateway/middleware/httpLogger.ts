import pinoHttp, {Options} from 'pino-http'
import {destination} from 'pino'
import {nanoid} from 'nanoid'
import * as pkg from '../../../package.json'

const defaultOption: Options = {
  mixin() {
    return {
      moduleName: pkg.name,
    }
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
}

const httpLogger = pinoHttp(
  {
    ...defaultOption,
    genReqId(req) {
      req.id = nanoid()
      return req.id
    },
  },
  destination(process.stdout),
)

export default httpLogger
