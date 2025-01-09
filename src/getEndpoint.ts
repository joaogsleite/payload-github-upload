import { getPluginOptions } from './plugin'
import { compressImage, parseFilename } from './compress'

export default async function (_: any, { params }: { params: Promise<{ filename: string }> }) {

  const pluginOptions = getPluginOptions()
  if (!pluginOptions) return Response.json({}, { status: 500 });
  const { repo, branch, token } = pluginOptions
  if (!repo || !branch || !token) return Response.json({}, { status: 500 });
  const fileInfo = parseFilename((await params).filename)
  if (!fileInfo) {
    return Response.json({}, { status: 404 })
  }

  const baseUrl = `https://raw.githubusercontent.com/${repo}/${branch}`
  const fetchConfig = {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`
    }
  }
  const filename = `${fileInfo.filename}.${fileInfo.extension}`
  const response = await fetch(`${baseUrl}/${filename}`, fetchConfig)

  const contents = fileInfo.isImage
    ? await compressImage(await response.arrayBuffer(), fileInfo)
    : response.body

  const contentType = response.headers.get('Content-Type')
  return new Response(contents, { headers: { 'Content-Type': contentType } })
}
