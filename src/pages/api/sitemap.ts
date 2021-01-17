import { IncomingMessage, ServerResponse } from 'http'

import getBlogIndex from '../../lib/notion/getBlogIndex'
import { postIsPublished, getTagLink } from '../../lib/blog-helpers'

function mapToURL(tag) {
  return `
    <url>
      <loc>https://alpacat.com${getTagLink(tag)}</loc>
      <changefreq>weekly</changefreq>
    </url>`
}

function concat(total, item) {
  return total + item
}

function createSitemap(tags = []) {
  const tagsString = tags.map(mapToURL).reduce(concat, '')

  return `<?xml version="1.0" encoding="utf-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://alpacat.com</loc>
    </url>
    <url>
      <loc>https://alpacat.com/blog</loc>
      <changefreq>weekly</changefreq>
    </url>${tagsString}
  </urlset>`
}

export default async function(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'text/xml')
  try {
    const postsTable = await getBlogIndex()

    const tags: string[] = Object.keys(postsTable)
      .filter(slug => postIsPublished(postsTable[slug]))
      .map(slug => postsTable[slug].Tags)
      .flat()
      .filter((tag, index, self) => self.indexOf(tag) === index)

    res.write(createSitemap(tags))
    res.end()
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.end()
  }
}
