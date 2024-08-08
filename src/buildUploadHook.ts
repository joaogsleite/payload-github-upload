import path from 'path'
import { CollectionBeforeChangeHook } from 'payload/types'
import { FileData } from 'payload/dist/uploads/types'
import { GithubUploadCollectionConfig, File, IPluginConfig } from './types'

function randomFilename(originalFilename: string) {
  const key = Math.random().toString(36).slice(2)
  const ext = path.extname(originalFilename)
  return `${key}${ext}`
}

const getFilesToUpload = ({
  data,
  req,
}): File[] => {
  const reqFile = req.files?.file ?? req.file ?? null
  if (reqFile == null) return []
  data.filename = randomFilename(data.filename)
  const files: File[] = [
    {
      filename: data.filename,
      mimeType: data.mimeType,
      buffer: reqFile.data,
    },
  ]
  if (data.mimeType?.includes('image') && data.sizes != null) {
    Object.entries<FileData>(data.sizes).forEach(([key, sizeData]) => {
      const buffer = req.payloadUploadSizes[key]
      if (buffer != null || sizeData.filename != null) {
        sizeData.filename = randomFilename(data.filename)
        files.push({
          buffer,
          filename: sizeData.filename,
          mimeType: data.mimeType,
        })
      }
    })
  }
  return files
}

const buildUploadHook = (
  { repo, branch, token }: IPluginConfig,
  collection: GithubUploadCollectionConfig,
): CollectionBeforeChangeHook => {
  
  const uploadHook: CollectionBeforeChangeHook = async (
    beforeChangeOptions
  ) => {
    const files = getFilesToUpload(beforeChangeOptions)
    for (const file of files) {
      await fetch(`https://api.github.com/repos/${repo}/contents/${file.filename}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          branch: branch,
          message: 'Uploading file',
          content: file.buffer.toString('base64')
        })
      })
    }
    return beforeChangeOptions.data
  }
  return uploadHook
}

export default buildUploadHook