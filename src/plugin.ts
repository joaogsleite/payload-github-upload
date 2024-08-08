import type { Config, Plugin } from 'payload/config'

import buildUploadHook from './buildUploadHook'
import buildDeleteHook from './buildDeleteHook'
import buildGetEndpoint from './buildGetEndpoint'
import { IPluginConfig, GithubUploadCollectionConfig } from './types'

const pluginPayloadGithubUpload = (pluginOptions?: IPluginConfig): Plugin => {
  
  return (payloadConfig) => {
    const uploadCollections = payloadConfig.collections.filter(
      (collection) => (collection.upload as any)?.github != null
    )
    uploadCollections.forEach((collection: GithubUploadCollectionConfig) => {
      if (collection.hooks == null) collection.hooks = {}
      if (collection.hooks.beforeChange == null)
        collection.hooks.beforeChange = []
      if (collection.hooks.afterDelete == null)
        collection.hooks.afterDelete = []
      collection.hooks.beforeChange.push(buildUploadHook(pluginOptions, collection))
      collection.hooks.afterDelete.push(buildDeleteHook(pluginOptions, collection))
      // comply with payload strict checking
      delete collection.upload.github
    })
    payloadConfig.endpoints = [
      ...(payloadConfig.endpoints || []),
     buildGetEndpoint(pluginOptions),
    ]
    return payloadConfig
  }
}

export default pluginPayloadGithubUpload