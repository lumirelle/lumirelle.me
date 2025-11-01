import { confirm } from '@clack/prompts'
import Git from 'simple-git'
import { compressImages } from './img-compress'

const git = Git()
const stagedFiles = (await git.diff(['--cached', '--name-only']))
  .split('\n')
  .map(i => i.trim())
  .filter(Boolean)

const images = stagedFiles.filter(i => i.match(/\.(png|jpe?g|webp)$/i))
if (images.length > 0) {
  console.log('Images to compress:\n', images)
  const isConfirmed = await confirm({
    message: `Compress ${images.length} images?`,
  })

  compressImages(images)

  if (!isConfirmed)
    process.exit(0)
}
else {
  console.log('No images to compress')
  process.exit(0)
}
