 # Upload files to GitHub repo from Payload CMS

This plugin sends uploaded files to GitHub repo instead of writing them to the server file system.  
Resized images are properly supported.

This project was based on [payload-s3-upload](https://github.com/jeanbmar/payload-s3-upload) from [jeanbmar](https://github.com/jeanbmar).
Thank you!

## Install

`npm install payload-github-upload --legacy-peer-deps`

Payload requires `legacy-peer-deps` because of conflicts on React and GraphQL dependencies (see Payload [docs](https://payloadcms.com/docs/getting-started/installation)).

## Getting Started

### Enable plugin in Payload CMS config

```js
import { buildConfig } from 'payload/config'
import githubUpload from 'payload-github-upload'

export default buildConfig({
  // ...
  plugins: [
    githubUpload({
      repo: '<user>/<repo>'
      branch: 'uploads',
      token: process.env.GITHUB_TOKEN,
    }),
  ],
})
```

### Configure your upload collections 

```js
import { UploadCollectionConfig } from 'payload-github-upload'

const Media: GithubUploadCollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/assets',
    staticDir: 'assets',
    disableLocalStorage: true,
    github: true,
    adminThumbnail: ({ doc }) =>
      `https://<my-payload-instance-url>/uploads/${doc.filename}`,
  },
  // create a field to access uploaded files in github from payload api
  fields: [
    {
      name: 'url',
      type: 'text',
      access: {
        create: () => false,
      },
      admin: {
        disabled: true,
      },
      hooks: {
        afterRead: [
          ({ data: doc }) =>
            `https://<my-payload-instance-url>/uploads/${doc.filename}`,
        ],
      },
    },
  ],
}

export default Media
```

### Recipe for handling different sizes

This plugin automatically uploads image variants in Github.

However, in order to retrieve correct URLs for the different sizes in the API, additional hooks should be implemented.

```js
import { GithubUploadCollectionConfig } from 'payload-github-upload'

const Media: GithubUploadCollectionConfig = {
  slug: 'media',
  upload: {
    // ...
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        crop: 'center'
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        crop: 'center'
      },
      {
        name: 'tablet',
        width: 1024,
        height: null,
        crop: 'center'
      }
    ],
    adminThumbnail: 'thumbnail',
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        // add a url property on the main image
        doc.url = `https://<my-payload-instance-url>/uploads/${doc.filename}`

        // add a url property on each imageSize
        Object.keys(doc.sizes)
          .forEach(k => doc.sizes[k].url = `https://<my-payload-instance-url>/uploads/${doc.sizes[k].filename}`)
      }
    ]
  },
  fields: []
}

export default Media
```
