import { $ } from 'bun'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'pathe'
import { isCI } from 'std-env'

const CERTS_DIR = 'certs'
const CERT_FILE = join(CERTS_DIR, 'localhost.pem')
const CERT_KEY_FILE = join(CERTS_DIR, 'localhost-key.pem')

if (!isCI) {
  const result = await $`mkcert -install`
  if (result.exitCode !== 0) {
    process.exit(result.exitCode)
  }

  if (!existsSync(CERT_FILE) || !existsSync(CERT_KEY_FILE)) {
    mkdirSync(CERTS_DIR, { recursive: true })
    await $`mkcert --cert-file ${CERT_FILE} --key-file ${CERT_KEY_FILE} localhost`
  }
  else {
    console.log('Cert files already exist, skipping generation.')
  }
}
