import { Buffer } from 'node:buffer'
import { CollectionConfig } from 'payload/types'
import { IncomingUploadType } from 'payload/dist/uploads/types'

export type IPluginConfig = {
  repo: string
  branch: string
  token: string
  endpoint?: string
}

export type GithubIncomingUploadType = {
  github: boolean
} & IncomingUploadType

export type GithubUploadCollectionConfig = {
  upload: GithubIncomingUploadType
} & CollectionConfig

export type File = {
  filename: string
  mimeType?: string
  buffer: Buffer
}