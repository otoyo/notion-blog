const path = require('path')
const fs = require('fs')

const {
  NOTION_API_SECRET,
  DATABASE_ID,
  BLOG_INDEX_CACHE,
} = require('./server-constants')
const { Client } = require('@notionhq/client')

const notionClient = new Client({
  auth: NOTION_API_SECRET,
})

exports.exists = function() {
  return fs.existsSync(path.resolve(BLOG_INDEX_CACHE))
}

exports.get = function() {
  return JSON.parse(fs.readFileSync(path.resolve(BLOG_INDEX_CACHE)))
}

exports.set = async function() {
  let params = {
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: new Date().toISOString(),
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Date',
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
    page_size: 100,
  }

  let results = []

  while (true) {
    const data = await notionClient.databases.query(params)

    results = results.concat(data.results)

    if (!data.has_more) {
      break
    }

    params['start_cursor'] = data.next_cursor
  }

  fs.writeFileSync(path.resolve(BLOG_INDEX_CACHE), JSON.stringify(results))
  console.log(`Cached ${results.length} posts into ${BLOG_INDEX_CACHE}`)

  return
}
