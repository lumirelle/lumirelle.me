import type { Plugin } from 'vite'

export function Await(promises: Promise<any>[]): Plugin<any> | Plugin<any>[] {
  return {
    name: 'await',
    async closeBundle(): Promise<void> {
      await Promise.all(promises)
    },
  }
}
