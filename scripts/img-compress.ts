// oxlint-disable no-console

import fs from 'node:fs/promises'
import { styleText } from 'node:util'
import sharp from 'sharp'

const maxSize = 1440

interface CompressSharpReturn {
  image: sharp.Sharp
  outBuffer: Buffer
  size: number
  outSize: number
  percent: number
  inFile: string
  outFile: string
}

export async function compressSharp(
  image: sharp.Sharp,
  inBuffer: Buffer,
  inFile: string,
  outFile: string,
): Promise<CompressSharpReturn> {
  const { format, width, height } = await image.metadata()
  if (!width || !height) {
    throw new Error(`Could not determine size of ${inFile}`)
  }
  if (format !== 'jpeg' && format !== 'png' && format !== 'webp') {
    throw new Error(`Unsupported format ${format} of ${inFile}`)
  }

  let processedImage = image
  if (width > maxSize || height > maxSize) {
    processedImage = processedImage.resize(maxSize)
  }
  processedImage = processedImage[format]({
    quality: format === 'png' ? 100 : 80,
    compressionLevel: 9,
  })

  const outBuffer = await processedImage.withMetadata().toBuffer()
  const size = inBuffer.byteLength
  const outSize = outBuffer.byteLength

  const percent = (outSize - size) / size
  return {
    image: processedImage,
    outBuffer,
    size,
    outSize,
    percent,
    inFile,
    outFile,
  }
}

function bytesToHuman(size: number): string {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`.padStart(10, ' ')
}

export async function compressImages(files: string[]): Promise<void> {
  await Promise.all(
    files.map(async (file) => {
      const buffer = await fs.readFile(file)
      const image = sharp(buffer)
      const { percent, size, outSize, inFile, outFile, outBuffer } = await compressSharp(
        image,
        buffer,
        file,
        file,
      )
      if (percent > -0.1) {
        console.log(
          styleText(
            'dim',
            `[SKIP] ${bytesToHuman(size)} -> ${bytesToHuman(outSize)} ${(percent * 100).toFixed(1).padStart(5, ' ')}%  ${inFile}`,
          ),
        )
      }
      else {
        await fs.writeFile(outFile, outBuffer)
        console.log(
          `[COMP] ${bytesToHuman(size)} -> ${bytesToHuman(outSize)} ${styleText('green', `${(percent * 100).toFixed(1).padStart(5, ' ')}%`)}  ${inFile}`,
        )
      }
    }),
  )
}
