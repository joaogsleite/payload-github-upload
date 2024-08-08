import { CollectionAfterDeleteHook } from 'payload/types'
import { FileData } from 'payload/dist/uploads/types'
import { IPluginConfig, GithubUploadCollectionConfig } from './types'

const getFilesToDelete: CollectionAfterDeleteHook = (afterDeleteOptions) => {
  const { doc } = afterDeleteOptions
  const files: string[] = [doc.filename]
  if (doc.mimeType?.includes('image') && doc.sizes != null) {
    Object.values<FileData>(doc.sizes).forEach((fileData) => {
      if (fileData.filename != null) files.push(fileData.filename)
    })
  }
  return files
}

const buildDeleteHook = (
  config: IPluginConfig,
  collection: GithubUploadCollectionConfig
) => {
  const deleteHook: CollectionAfterDeleteHook = async (afterDeleteOptions) => {
    const filenames = getFilesToDelete(afterDeleteOptions)
    for (const filename of filenames) {
      let key = filename
      // TODO: delete file on github
    }
  }
  return deleteHook
}

export default buildDeleteHook