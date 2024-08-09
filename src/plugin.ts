import type { Plugin } from 'payload/config'

import buildUploadHook from './buildUploadHook'
import buildDeleteHook from './buildDeleteHook'
import { IPluginConfig, GithubUploadCollectionConfig } from './types'


let PLUGIN_OPTIONS: IPluginConfig

export function getPluginOptions() {
  return PLUGIN_OPTIONS
}

const pluginPayloadGithubUpload = (pluginOptions?: IPluginConfig): Plugin => {

  PLUGIN_OPTIONS = pluginOptions
  
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
    return payloadConfig
  }
}

export default pluginPayloadGithubUpload