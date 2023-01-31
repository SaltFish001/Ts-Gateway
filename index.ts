import cluster, {Worker} from 'cluster'
import {join} from 'path'
import Config from './config'
import logger, {fileLogs} from './lib/logger'

cluster.setupMaster({
  exec: join(__dirname, './src'),
  silent: true,
})

const initWorker = (): Worker => {
  const worker = cluster.fork()
  worker.process.stdout.pipe(fileLogs('info'), {
    end: true,
  })
  worker.process.stderr.pipe(fileLogs('error'), {
    end: true,
  })
  worker.once('exit', (code, signal) => {
    logger.fatal(`Worker exit with code: ${code}, reson: ${signal || 'unknown'} `)
    // 重启一个worker
    initWorker()
  })
  return worker
}

for (let i = 0; i < Config.clusterNumber; i++) {
  initWorker()
}
