import pino, {LoggerOptions} from 'pino'
import Config from '../../config'
import * as pkg from '../../package.json'

const defaultOption: LoggerOptions = {
  mixin() {
    return {
      moduleName: pkg.name,
    }
  },
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
}

const defaultLogger = pino(
  {
    ...defaultOption,
    level: Config.env === 'develop' ? 'debug' : 'info',
  },
  pino.destination(process.stdout),
)
const fatalLogger = pino(
  {
    ...defaultOption,
    level: 'fatal',
  },
  pino.destination(process.stderr),
)

export default {
  debug: defaultLogger.debug.bind(defaultLogger) as pino.LogFn,
  info: defaultLogger.info.bind(defaultLogger) as pino.LogFn,
  warn: defaultLogger.warn.bind(defaultLogger) as pino.LogFn,
  error: defaultLogger.error.bind(defaultLogger) as pino.LogFn,
  fatal: fatalLogger.fatal.bind(fatalLogger) as pino.LogFn,
}
