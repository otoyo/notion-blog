import { IncomingMessage, ServerResponse } from 'http'

import { getBlogLink } from '../../lib/blog-helpers'
import { getPosts } from '../../lib/notion/client'
import { Post } from '../../lib/notion/interfaces'

function decode(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function mapToEntry(post: Post) {
  const date = new Date(post.Date)
  return `
    <entry>
      <id>https://alpacat.com${getBlogLink(post.Slug)}</id>
      <title>${decode(post.Title)}</title>
      <link href="https://alpacat.com${getBlogLink(post.Slug)}"/>
      <published>${date.toJSON()}</published>
      <updated>${date.toJSON()}</updated>
      <author>
        <name>@otoyo0122</name>
        <uri>https://twitter.com/otoyo0122</uri>
      </author>
      <content type="xhtml">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${post.Excerpt}
        </div>
      </content>
    </entry>`
}

function concat(total: string, item: string) {
  return total + item
}

function createRSS(posts: Array<Post> = []) {
  const postsString = posts.map(mapToEntry).reduce(concat, '')
  const updated =
    posts.length > 0
      ? `
    <updated>${new Date(posts[0].Date).toJSON()}</updated>`
      : ''

  return `<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>アルパカログ</title>
    <subtitle>アルパカログの更新情報</subtitle>
    <link href="https://alpacat.com/feed" rel="self" type="application/rss+xml"/>
    <link href="https://alpacat.com" />${updated}
    <id>https://alpacat.com/feed</id>${postsString}
  </feed>`
}

const Feed = async function(_req: IncomingMessage, res: ServerResponse) {
  try {
    const posts = await getPosts()
    res.write(createRSS(posts))
    res.end()
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.end()
  }
}

export default Feed
