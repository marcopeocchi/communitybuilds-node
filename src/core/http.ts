import { get } from 'https'

module myHttp {
  export function json<T>(hostname: string, {
    path,
    headers,
  }: { path: string, headers?: any }) {
    return new Promise<T>((resolve, reject) => {
      const options = {
        hostname: hostname,
        path: path,
        headers,
        method: 'GET',
        port: 443,
      }
      let chunks: any[] = []
      get(options, (res) => {
        // push the http packets chunks into the buffer
        res.on('data', (chunk) => {
          chunks.push(chunk)
        })
        // the connection has ended so build the body from the buffer
        // parse it as a JSON and get the tag_name
        res.on('end', () => {
          const buffer = Buffer.concat(chunks)
          try {
            const data = JSON.parse(buffer.toString())
            if (!data.error) {
              resolve(data.values)
            }
            reject(data.error)
          }
          catch (err) {
            reject(err)
          }
        })
        res.on('error', (error) => {
          reject(error)
        })
      }).on('error', (error) => {
        reject(error)
      })
    })
  }
  export function html(hostname: string, {
    path,
    headers,
  }: {
    path: string,
    headers?: any
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: hostname,
        path: path,
        headers,
        method: 'GET',
        port: 443,
      }
      let chunks: any[] = []
      get(options, (res) => {
        res.on('data', (chunk) => {
          chunks.push(chunk)
        })
        res.on('end', () => {
          resolve(Buffer.concat(chunks).toString())
        })
        res.on('error', (error) => {
          reject(error)
        })
      }).on('error', (error) => {
        reject(error)
      })
    })
  }
}

export default myHttp