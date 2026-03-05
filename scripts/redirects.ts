import fs from 'node:fs/promises'
import { Octokit } from '@octokit/rest'
import { getStarsRankingUrl } from './stars-rank'

const pages = 2

async function run(): Promise<void> {
  const manual = await fs.readFile('_redirects', 'utf8')
  const gh = new Octokit({ auth: process.env.GITHUB_TOKEN! })

  const redirects: [string, string, number][] = [['/stars-rank', getStarsRankingUrl(), 302]]

  for (let i = 1; i <= pages; i++) {
    const { data: repos } = await gh.repos.listForUser({
      type: 'owner',
      username: 'lumirelle',
      per_page: 100,
      page: i,
    })

    for (const repo of repos) {
      if (
        ['test', 'static', 'repro', 'issue', 'resume', 'lumirelle'].some((e) =>
          repo.name.includes(e),
        )
      ) {
        continue
      }
      if (!repo.private && !repo.fork && !repo.archived) {
        redirects.push([`/${repo.name}`, repo.html_url, 302])
      }
    }
  }

  const final = `${manual}\n${redirects.map((i) => i.join('\t')).join('\n')}`

  await fs.writeFile('_dist_redirects', final, 'utf8')
}

await run()
