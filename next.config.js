const fs = require('fs')
const path = require('path')
const {
  NOTION_TOKEN,
  BLOG_INDEX_ID,
  NOTION_API_SECRET,
  DATABASE_ID,
} = require('./src/lib/notion/server-constants')

try {
  fs.unlinkSync(path.resolve('.blog_index_data'))
} catch (_) {
  /* non fatal */
}
try {
  fs.unlinkSync(path.resolve('.blog_index_data_previews'))
} catch (_) {
  /* non fatal */
}

const warnOrError =
  process.env.NODE_ENV !== 'production'
    ? console.warn
    : msg => {
        throw new Error(msg)
      }

if (!NOTION_TOKEN) {
  // We aren't able to build or serve images from Notion without the
  // NOTION_TOKEN being populated
  warnOrError(
    `\nNOTION_TOKEN is missing from env, this will result in an error\n` +
      `Make sure to provide one before starting Next.js`
  )
}

if (!BLOG_INDEX_ID) {
  // We aren't able to build or serve images from Notion without the
  // NOTION_TOKEN being populated
  warnOrError(
    `\nBLOG_INDEX_ID is missing from env, this will result in an error\n` +
      `Make sure to provide one before starting Next.js`
  )
}

if (!NOTION_API_SECRET) {
  // We aren't able to build or serve images from Notion without the
  // NOTION_TOKEN being populated
  warnOrError(
    `\nNOTION_API_SECRET is missing from env, this will result in an error\n` +
      `Make sure to provide one before starting Next.js`
  )
}

if (!DATABASE_ID) {
  // We aren't able to build or serve images from Notion without the
  // NOTION_TOKEN being populated
  warnOrError(
    `\nDATABASE_ID is missing from env, this will result in an error\n` +
      `Make sure to provide one before starting Next.js`
  )
}

module.exports = {
  target: 'experimental-serverless-trace',

  experimental: {
    modern: true,
    async rewrites() {
      return [
        { source: '/atom', destination: '/api/atom' },
        { source: '/sitemap', destination: '/api/sitemap' },
      ]
    },
    catchAllRouting: true,
  },
}
