// use commonjs so it can be required without transpiling
const path = require('path')

const NOTION_API_SECRET = process.env.NOTION_API_SECRET
const DATABASE_ID = process.env.DATABASE_ID
const BLOG_INDEX_CACHE = path.resolve('.blog_index_data')

module.exports = {
  NOTION_API_SECRET,
  DATABASE_ID,
  BLOG_INDEX_CACHE,
}
