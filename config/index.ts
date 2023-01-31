import {Route, Method, WebSocketRoute} from 'fast-gateway'
import {readFileSync} from 'node:fs'
import {config} from 'dotenv'
import path from 'node:path'

export type JsonConfig = {
  gatewayRoutes: Record<string, Route | WebSocketRoute>
  hostnames2prefix: {
    prefix: string
    hostname: string
  }[]
}
const jsonConfig: JsonConfig = JSON.parse(readFileSync(path.join(process.cwd(), 'routes.json')).toString())
export interface Config extends Record<string, unknown> {
  gatewayRoutes: Record<string, Route | WebSocketRoute>
  hostnames2prefix: {
    prefix: string
    hostname: string
  }[]
  port: number
  env: 'develop' | 'test' | 'prod'
}
export interface APIRole {
  prefix: string
  method: Method | 'ALL' | 'WS'
}
export interface WSConfig {
  path: string
  server: string
}

const Env = process.env

const getNodeEnv: () => 'develop' | 'test' | 'prod' = () => {
  const envList = ['develop', 'test', 'prod']
  const nodeEnv = process.env.NODE_ENV as 'develop' | 'test' | 'prod'
  // console.log(`nodeEnv >>> ${nodeEnv}`)
  if (envList.findIndex(ele => nodeEnv === ele) !== -1) {
    return nodeEnv
  }

  return 'develop'
}
// 运行环境
// 开发: develop
// 测试: test
// 生产: prod
const NodeEnv = getNodeEnv()

if (NodeEnv === 'develop') {
  config({
    path: path.join(process.cwd(), '.env'),
  })
}

const Config: Config = {
  hostnames2prefix: [...jsonConfig.hostnames2prefix],
  gatewayRoutes: {
    ...jsonConfig.gatewayRoutes,
  },
  // 对外端口
  port: Number(`${Env.PORT || 3000}`),
  // 单机进程数
  clusterNumber: Number(process.env.CLUSTER_NUMBER) || 4,
  env: NodeEnv || 'develop',
}

export default Config
