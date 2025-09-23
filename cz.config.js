// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { definePrompt } from 'czg'

/* -------------------------- Config for generation ------------------------- */
const modulesDir = 'pages'

/* ---------------------------- Scopes generation --------------------------- */
/**
 * @param {string} dir
 * @return {string[]} names of directories under `dir`
 */
function getModuleNames(dir) {
  return fs.readdirSync(path.resolve(import.meta.dirname, dir)).filter((file) => {
    return fs.statSync(path.resolve(import.meta.dirname, dir, file)).isDirectory() && !file.match(/^\.|node_modules/)
  })
}

/**
 * @param {string} str
 * @param {number} length
 * @return {string} `str` if `str.length >= length`, else `str` padded with spaces to `length`
 */
function formatName(str, length) {
  if (str.length >= length)
    return str
  return str + ' '.repeat(length - str.length)
}

const modules = getModuleNames(modulesDir)
const maxLenModuleName = Math.max(...modules.map(mod => mod.length)) + 1 // +1 for `:`
const moduleScopes = modules.map(mod => ({
  value: mod,
  name: `${formatName(`${mod}:`, maxLenModuleName)} ${modulesDir}/${mod}`,
}))

/* --------------------------------- Config --------------------------------- */

export default definePrompt({
  alias: {
    typo: 'docs: fix typos',
    readme: 'docs: update README.md',
    deps: 'chore: update dependencies',
  },

  scopes: moduleScopes,
  scopeOverrides: {
    chore: [
      ...moduleScopes,
      { value: 'deps', name: `${formatName('deps: ', maxLenModuleName)} A dependencies change` },
      { value: 'tools', name: `${formatName('tools: ', maxLenModuleName)} A tools and utilities change` },
    ],
  },

  allowBreakingChanges: ['feat', 'fix', 'chore'],
  markBreakingChangeMode: true,

  skipQuestions: ['footerPrefix', 'footer', 'confirmCommit'],
})
