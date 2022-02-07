import { IncomingMessage, ServerResponse } from 'http'

import { getTagLink } from '../../lib/blog-helpers'
import { getAllTags } from '../../lib/notion/client'
import { BLOG_INDEX_CACHE } from '../../lib/notion/server-constants'

export const config = {
  unstable_excludeFiles: [BLOG_INDEX_CACHE],
}

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
      <loc>https://alpacat.com/subscribe</loc>
    </url>
    <url>
      <loc>https://alpacat.com/blog</loc>
      <changefreq>weekly</changefreq>
    </url>${tagsString}
  </urlset>`
}

const Sitemap = async function(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'text/xml')
  try {
    const tags: string[] = await getAllTags()
    res.write(createSitemap(tags))
    res.end()
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.end()
  }
}

export default Sitemap
