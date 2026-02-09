import type { FeedOptions, Item } from 'feed'
import fs from 'node:fs/promises'
import { dirname } from 'node:path'
import { Feed } from 'feed'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import { glob } from 'tinyglobby'

const DOMAIN = 'https://lumirelle.me'
const AUTHOR = {
  name: 'Lumirelle',
  email: 'shabbyacc@outlook.com',
  link: DOMAIN,
}
const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

async function run() {
  await buildBlogRSS()
}

async function buildBlogRSS() {
  const files = await glob('pages/posts/*.md', {
    expandDirectories: false,
  })

  const options = {
    title: 'Lumirelle',
    description: 'Lumirelle\' Blog',
    id: 'https://lumirelle.me/',
    link: 'https://lumirelle.me/',
    copyright: 'CC BY-NC-SA 4.0 2025 © Lumirelle',
    feedLinks: {
      json: 'https://lumirelle.me/feed.json',
      atom: 'https://lumirelle.me/feed.atom',
      rss: 'https://lumirelle.me/feed.xml',
    },
  }
  const posts: any[] = (
    await Promise.all(
      files.filter(i => !i.includes('index'))
        .map(async (i) => {
          const raw = await fs.readFile(i, 'utf-8')
          const { data, content } = matter(raw)

          if (data.lang !== 'en')
            return

          const html = markdown.render(content)
            .replace('src="/', `src="${DOMAIN}/`)

          if (data.image?.startsWith('/'))
            data.image = DOMAIN + data.image

          return {
            ...data,
            date: new Date(data.date),
            content: html,
            author: [AUTHOR],
            link: DOMAIN + i.replace(/^pages(.+)\.md$/, '$1'),
          }
        }),
    ))
    .filter(Boolean)

  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))

  await writeFeed('feed', options, posts)
}

async function writeFeed(name: string, options: FeedOptions, items: Item[]) {
  options.author = AUTHOR
  options.image = 'https://lumirelle.me/avatar.png'
  options.favicon = 'https://lumirelle.me/favicon.png'

  const feed = new Feed(options)

  items.forEach(item => feed.addItem(item))
  // items.forEach(i=> console.log(i.title, i.date))

  await fs.mkdir(dirname(`./dist/${name}`), { recursive: true })
  await fs.writeFile(`./dist/${name}.xml`, feed.rss2(), 'utf-8')
  await fs.writeFile(`./dist/${name}.atom`, feed.atom1(), 'utf-8')
  await fs.writeFile(`./dist/${name}.json`, feed.json1(), 'utf-8')
}

await run()
