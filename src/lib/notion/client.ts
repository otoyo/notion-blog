import { NOTION_API_SECRET, DATABASE_ID } from './server-constants'
import {
  Post,
  Block,
  Image,
  Code,
  Quote,
  Callout,
  Embed,
  Bookmark,
  LinkPreview,
  Table,
  TableRow,
  TableCell,
  RichText,
  Text,
  Annotation,
} from './interfaces'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('@notionhq/client')
import * as blogIndexCache from './blog-index-cache'

const client = new Client({
  auth: NOTION_API_SECRET,
})

export async function getPosts(pageSize = 10) {
  if (blogIndexCache.exists()) {
    const allPosts = await getAllPosts()
    return allPosts.slice(0, pageSize)
  }

  const params = {
    database_id: DATABASE_ID,
    filter: _buildFilter(),
    sorts: [
      {
        property: 'Date',
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
    page_size: pageSize,
  }

  const data = await client.databases.query(params)

  return data.results
    .filter(item => _validPost(item))
    .map(item => _buildPost(item))
}

export async function getAllPosts() {
  let results = []

  if (blogIndexCache.exists()) {
    results = blogIndexCache.get()
    console.log('Found cached posts.')
  } else {
    const params = {
      database_id: DATABASE_ID,
      filter: _buildFilter(),
      sorts: [
        {
          property: 'Date',
          timestamp: 'created_time',
          direction: 'descending',
        },
      ],
      page_size: 100,
    }

    while (true) {
      const data = await client.databases.query(params)

      results = results.concat(data.results)

      if (!data.has_more) {
        break
      }

      params['start_cursor'] = data.next_cursor
    }
  }

  return results.filter(item => _validPost(item)).map(item => _buildPost(item))
}

export async function getRankedPosts(pageSize = 10) {
  if (blogIndexCache.exists()) {
    const allPosts = await getAllPosts()
    return allPosts
      .filter(post => !!post.Rank)
      .sort((a, b) => {
        if (a.Rank > b.Rank) {
          return -1
        } else if (a.Rank === b.Rank) {
          return 0
        }
        return 1
      })
      .slice(0, pageSize)
  }

  const params = {
    database_id: DATABASE_ID,
    filter: _buildFilter([
      {
        property: 'Rank',
        number: {
          is_not_empty: true,
        },
      },
    ]),
    sorts: [
      {
        property: 'Rank',
        direction: 'descending',
      },
    ],
    page_size: pageSize,
  }

  const data = await client.databases.query(params)

  return data.results
    .filter(item => _validPost(item))
    .map(item => _buildPost(item))
}

export async function getPostsBefore(date: string, pageSize = 10) {
  if (blogIndexCache.exists()) {
    const allPosts = await getAllPosts()
    return allPosts.filter(post => post.Date < date).slice(0, pageSize)
  }

  const params = {
    database_id: DATABASE_ID,
    filter: _buildFilter([
      {
        property: 'Date',
        date: {
          before: date,
        },
      },
    ]),
    sorts: [
      {
        property: 'Date',
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
    page_size: pageSize,
  }

  const data = await client.databases.query(params)

  return data.results
    .filter(item => _validPost(item))
    .map(item => _buildPost(item))
}

export async function getFirstPost() {
  if (blogIndexCache.exists()) {
    const allPosts = await getAllPosts()
    return allPosts[allPosts.length - 1]
  }

  const params = {
    database_id: DATABASE_ID,
    filter: _buildFilter(),
    sorts: [
      {
        property: 'Date',
        timestamp: 'created_time',
        direction: 'ascending',
      },
    ],
    page_size: 1,
  }

  const data = await client.databases.query(params)

  if (!data.results.length) {
    return null
  }

  if (!_validPost(data.results[0])) {
    return null
  }

  return _buildPost(data.results[0])
}

export async function getPostBySlug(slug: string) {
  if (blogIndexCache.exists()) {
    const allPosts = await getAllPosts()
    return allPosts.find(post => post.Slug === slug)
  }

  const data = await client.databases.query({
    database_id: DATABASE_ID,
    filter: _buildFilter([
      {
        property: 'Slug',
        text: {
          equals: slug,
        },
      },
    ]),
    sorts: [
      {
        property: 'Date',
        timestamp: 'created_time',
        direction: 'ascending',
      },
    ],
  })

  if (!data.results.length) {
    return null
  }

  if (!_validPost(data.results[0])) {
    return null
  }

  return _buildPost(data.results[0])
}

export async function getPostsByTag(tag: string, pageSize = 100) {
  if (blogIndexCache.exists()) {
    const allPosts = await getAllPosts()
    return allPosts.filter(post => post.Tags.includes(tag)).slice(0, pageSize)
  }

  const params = {
    database_id: DATABASE_ID,
    filter: _buildFilter([
      {
        property: 'Tags',
        multi_select: {
          contains: tag,
        },
      },
    ]),
    sorts: [
      {
        property: 'Date',
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
    page_size: pageSize,
  }

  const data = await client.databases.query(params)

  return data.results
    .filter(item => _validPost(item))
    .map(item => _buildPost(item))
}

export async function getAllBlocksByBlockId(blockId) {
  let allBlocks: Block[] = []

  const params = {
    block_id: blockId,
  }

  while (true) {
    const data = await client.blocks.children.list(params)

    const blocks = data.results.map(item => {
      let block = null

      switch (item.type) {
        case 'paragraph':
        case 'heading_1':
        case 'heading_2':
        case 'heading_3':
        case 'bulleted_list_item':
        case 'numbered_list_item':
          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            RichTexts: item[item.type].text.map(_buildRichText),
          }
          break
        case 'image':
          const image: Image = {
            Caption: item.image.caption.map(_buildRichText),
            Type: item.image.type,
          }

          if (item.image.type === 'external') {
            image.External = { Url: item.image.external.url }
          } else {
            image.File = { Url: item.image.file.url }
          }

          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            Image: image,
          }
          break
        case 'code':
          const code: Code = {
            Caption: item[item.type].caption.map(_buildRichText),
            Text: item[item.type].text.map(_buildRichText),
            Language: item.code.language,
          }

          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            Code: code,
          }
          break
        case 'quote':
          const quote: Quote = {
            Text: item[item.type].text.map(_buildRichText),
          }

          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            Quote: quote,
          }
          break
        case 'callout':
          const callout: Callout = {
            RichTexts: item[item.type].text.map(_buildRichText),
            Icon: {
              Emoji: item[item.type].icon.emoji,
            },
          }

          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            Callout: callout,
          }
          break
        case 'embed':
          const embed: Embed = {
            Url: item.embed.url,
          }

          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            Embed: embed,
          }
          break
        case 'bookmark':
          const bookmark: Bookmark = {
            Url: item.bookmark.url,
          }

          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            Bookmark: bookmark,
          }
          break
        case 'link_preview':
          const linkPreview: LinkPreview = {
            Url: item.link_preview.url,
          }

          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            LinkPreview: linkPreview,
          }
          break
        case 'table':
          const table: Table = {
            TableWidth: item.table.table_width,
            HasColumnHeader: item.table.has_column_header,
            HasRowHeader: item.table.has_row_header,
            Rows: [],
          }

          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            Table: table,
          }
          break
        case 'table_row':
          const cells: TableCell[] = item.table_row.cells.map(cell => {
            const tableCell: TableCell = {
              RichTexts: cell.map(_buildRichText),
            }

            return tableCell
          })

          const tableRow: TableRow = {
            Cells: cells,
          }

          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
            TableRow: tableRow,
          }
          break
        default:
          block = {
            Id: item.id,
            Type: item.type,
            HasChildren: item.has_children,
          }
          break
      }

      return block
    })

    allBlocks = allBlocks.concat(blocks)

    if (!data.has_more) {
      break
    }

    params['start_cursor'] = data.next_cursor
  }

  for (let i = 0; i < allBlocks.length; i++) {
    const block = allBlocks[i]

    if (block.Type === 'table') {
      // Fetch table_row
      block.Table.Rows = await getAllBlocksByBlockId(block.Id)
    }
  }

  return allBlocks
}

export async function getAllTags() {
  if (blogIndexCache.exists()) {
    const allPosts = await getAllPosts()
    return [...new Set(allPosts.flatMap(post => post.Tags))].sort()
  }

  const data = await client.databases.retrieve({
    database_id: DATABASE_ID,
  })
  return data.properties.Tags.multi_select.options
    .map(option => option.name)
    .sort()
}

function _buildFilter(conditions = []) {
  if (process.env.NODE_ENV === 'development') {
    return { and: conditions }
  }

  return {
    and: _uniqueConditions(
      conditions.concat([
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
      ])
    ),
  }
}

function _uniqueConditions(conditions = []) {
  const properties = []

  return conditions.filter(cond => {
    if (conditions.includes(cond.property)) {
      return false
    }
    properties.push(cond.property)
    return true
  })
}

function _validPost(data) {
  const prop = data.properties
  return (
    prop.Page.title.length > 0 &&
    prop.Slug.rich_text.length > 0 &&
    !!prop.Date.date
  )
}

function _buildPost(data) {
  const prop = data.properties

  const post: Post = {
    PageId: data.id,
    Title: prop.Page.title[0].plain_text,
    Slug: prop.Slug.rich_text[0].plain_text,
    Date: prop.Date.date.start,
    Tags: prop.Tags.multi_select.map(opt => opt.name),
    Excerpt:
      prop.Excerpt.rich_text.length > 0
        ? prop.Excerpt.rich_text[0].plain_text
        : '',
    OGImage:
      prop.OGImage.files.length > 0 ? prop.OGImage.files[0].file.url : null,
    Rank: prop.Rank.number,
  }

  return post
}

function _buildRichText(item) {
  const text: Text = {
    Content: item.text.content,
    Link: item.text.link,
  }

  const annotation: Annotation = {
    Bold: item.annotations.bold,
    Italic: item.annotations.italic,
    Strikethrough: item.annotations.strikethrough,
    Underline: item.annotations.underline,
    Code: item.annotations.code,
    Color: item.annotations.color,
  }

  const richText: RichText = {
    Text: text,
    Annotation: annotation,
    PlainText: item.plain_text,
    Href: item.href,
  }

  return richText
}
