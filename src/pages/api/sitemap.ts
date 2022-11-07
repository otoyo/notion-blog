import { IncomingMessage, ServerResponse } from 'http'

import { getTagLink } from '../../lib/blog-helpers'
import { getAllTags } from '../../lib/notion/client'

function mapToURL(tag: string) {
  return `
    <url>
      <loc>https://alpacat.com${getTagLink(tag)}</loc>
      <changefreq>weekly</changefreq>
    </url>`
}

function concat(total: string, item: string) {
  return total + item
}

function createSitemap(tags: Array<string> = []) {
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

const Sitemap = async function(_req: IncomingMessage, res: ServerResponse) {
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
