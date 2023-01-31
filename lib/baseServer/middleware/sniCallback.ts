import {readFileSync, existsSync, readdirSync, statSync} from 'node:fs'
import tls from 'node:tls'
import path from 'node:path'
import type {SecureContext} from 'node:tls'

export type SNI = {
  serverName: string
  cert: Buffer
  key: Buffer
  ca?: Buffer
}

const SNI_list: SNI[] = []

const keysPath = path.join(process.cwd(), 'keys')
const dirList = readdirSync(path.join(process.cwd(), 'keys'))
dirList.forEach(val => {
  if (statSync(path.join(keysPath, val)).isDirectory()) {
    const SNI: SNI = {
      serverName: val,
      cert: readFileSync(path.join(keysPath, val, 'server.crt')),
      key: readFileSync(path.join(keysPath, val, 'server.key')),
    }
    if (existsSync(path.join(keysPath, val, 'ca.crt'))) {
      SNI.ca = readFileSync(path.join(keysPath, val, 'ca.crt'))
    }
    SNI_list.push(SNI)
  }
})

// TODO: 遍历keys目录获取文件夹生成列表`
const SNICallback: (servername: string, cb: (err: Error | null, ctx: SecureContext) => void) => void = (
  servername,
  callback,
) => {
  const sniDefaultCert = readFileSync(path.join(keysPath, 'server.crt'))
  const sniDefaultKey = readFileSync(path.join(keysPath, 'server.key'))
  let sniDefaultCa: Buffer
  if (existsSync(path.join(keysPath, 'ca.crt'))) {
    sniDefaultCa = readFileSync(path.join(keysPath, 'ca.crt'))
  }
  try {
    let cert = sniDefaultCert
    let key = sniDefaultKey
    let ca = sniDefaultCa
    SNI_list.forEach(val => {
      if (val.serverName === servername) {
        cert = val.cert
        key = val.key
        ca = val.ca || null
      }
    })
    // if (servername === 'testing.com') {
    //   cert = readFileSync(path.join(__dirname, 'certs/testing.crt'))
    //   key = readFileSync(path.join(__dirname, 'certs/testing.key'))
    // } else {
    //   cert = sniDefaultCert
    //   key = sniDefaultKey
    // }
    const Options: tls.SecureContextOptions = {
      cert,
      key,
    }
    if (ca) {
      Options.ca = ca
    }
    callback(null, tls.createSecureContext(Options))
  } catch (error) {
    callback(error, null)
  }
}

export default SNICallback
