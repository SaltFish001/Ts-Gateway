import {appendFileSync, mkdirSync, existsSync} from 'fs'
import dayjs from 'dayjs'
import {join} from 'path'
import {Writable} from 'stream'

const getFilePath = (tail: string): string => {
  const basePath = join(process.cwd(), '/logs')
  if (!existsSync(basePath)) {
    mkdirSync(basePath)
  }
  const filePath = join(basePath, `${dayjs().format('YYYY-MM-DD')}_${tail}`)
  return filePath
}

/**
 * @param tail 日志文件后缀
 */
export default (tail: string): Writable => {
  const path = getFilePath(tail)
  const ownWriteAble = new Writable({
    write(chunk, enc, callback) {
      process.stdout.write(chunk)
      try {
        appendFileSync(path, chunk, {
          flag: 'a',
        })
        callback(null)
      } catch (error) {
        callback(error)
      }
      return true
    },
  })
  return ownWriteAble
}
