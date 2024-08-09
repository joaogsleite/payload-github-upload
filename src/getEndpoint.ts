import { getPluginOptions } from './plugin'

export const GET = async (_: any, { params: { filename } }: { params: { filename: string } }) => {
  
  const { repo, branch, token } = getPluginOptions()
  if (!repo || !branch || !token) return Response.json({}, { status: 500 });
  
  const baseUrl = `https://raw.githubusercontent.com/${repo}/${branch}`
  const fetchConfig = {
    method: 'GET',
    headers: {
      Authorization: `token ${token}`
    }
  }
  const { body, headers } = await fetch(`${baseUrl}/${filename}`, fetchConfig)
  
  const contentType = headers.get('Content-Type') 
  return new Response(body, { headers: { 'Content-Type': contentType } })
}
