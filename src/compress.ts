import sharp from 'sharp'

interface FileInfo {
  filename: string
  width?: number
  height?: number
  quality?: number
  extension: string
  isImage: boolean
  isJPEG: boolean
  isPNG: boolean
}

export function parseFilename(filename: string): FileInfo | undefined {
  const regex = /^(.+?)(?:-w(\d+))?(?:-h(\d+))?(?:-q(\d+))?\.(\w+)$/i
  const match = filename.match(regex)
  if (match) {
    return {
      filename: match[1],
      width: match[2] && Number(match[2]),
      height: match[3] && Number(match[3]),
      quality: match[4] && Number(match[4]),
      extension: match[5],
      isImage: ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp'].includes(match[5].toLowerCase()),
      isJPEG: ['jpeg', 'jpg'].includes(match[5].toLowerCase()),
      isPNG: match[1].toLowerCase() === 'png',
    }
  }
}

export function compressImage(buff: ArrayBuffer, info: FileInfo) {
  const opts = { width: info.width, height: info.height }
  let result = sharp(buff).resize(undefined, undefined, opts)
  if (info.quality) {
    if (info.isJPEG) {
      result = result.jpeg({ quality: info.quality })
    } else if (info.isJPEG) {
      result = result.png({ compressionLevel: Math.round(9-9*100/100) })
    }
  }
  return result.toBuffer()
}