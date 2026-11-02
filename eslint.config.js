// @ts-check
import { eslint } from '@lumirelle/linter-config/eslint'
import { options, pluginsOverride } from './linter.config.ts'

export default eslint(options).append(pluginsOverride)
