import { IncomingMessage, ServerResponse } from 'http'
import { renderToStaticMarkup } from 'react-dom/server'

import { textBlock } from '../../lib/notion/renderers'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import { postIsPublished, getBlogLink } from '../../lib/blog-helpers'

function mapToAuthor(author) {
  return `<author><name>${author.full_name}</name></author>`
}

function decode(string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function mapToEntry(post) {
  return `
    <entry>
      <id>https://alpacat.com${post.link}</id>
      <title>${decode(post.Page)}</title>
      <link href="https://alpacat.com${post.link}"/>
      <updated>${new Date(post.Date).toJSON()}</updated>
      <content type="xhtml">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${renderToStaticMarkup(post.Excerpt)}
        </div>
      </content>
    </entry>`
}

function concat(total, item) {
  return total + item
}

function createRSS(posts = []) {
  const postsString = posts.map(mapToEntry).reduce(concat, '')

  return `<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>アルパカログ</title>
    <subtitle>アルパカログの更新情報</subtitle>
    <link href="https://alpacat.com/atom" rel="self" type="application/rss+xml"/>
    <link href="https://alpacat.com" />
    <updated>${new Date(posts[0].Date).toJSON()}</updated>
    <id>alpacat.com/atom</id>${postsString}
  </feed>`
}

export default async function(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'text/xml')
  try {
    const postsTable = await getBlogIndex()
    const neededAuthors = new Set<string>()

    const posts = Object.keys(postsTable)
      .map(slug => {
        const post = postsTable[slug]
        if (!postIsPublished(post)) return

        post.authors = post.Authors || []

        for (const author of post.authors) {
          neededAuthors.add(author)
        }
        return post
      })
      .filter(Boolean)
      .sort((a, b) => (b.Date || 0) - (a.Date || 0))

    const { users } = await getNotionUsers([...neededAuthors])

    posts.forEach(post => {
      post.authors = post.authors.map(id => users[id])
      post.link = getBlogLink(post.Slug)
    })

    res.write(createRSS(posts))
    res.end()
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.end()
  }
}
