import { IPluginConfig } from './types'
import { Endpoint, PayloadHandler } from 'payload/config'

const buildGetEndpoint = (
  { repo, branch, token, endpoint }: IPluginConfig,
): Endpoint => {
  const handler: PayloadHandler = (req, res) => {
    const filename = req.params.filename
    fetch(`https://raw.githubusercontent.com/${repo}/${branch}/${filename}`, {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`
      }
    }).then(({ body, headers }) => {
      res.writeHead(200, { 'Content-Type': headers.get('Content-Type') })
      body.pipeTo(res)
    })
  }

  return {
    path: `${endpoint || '/uploads'}/:filename`,
    method: 'get',
    root: true,
    handler,
  }
}

export default buildGetEndpoint