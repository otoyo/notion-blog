import { NOTION_API_SECRET, DATABASE_ID } from './server-constants'
import * as responses from './responses'
import {
  Post,
  Block,
  Paragraph,
  Heading1,
  Heading2,
  Heading3,
  BulletedListItem,
  NumberedListItem,
  ToDo,
  Video,
  Image,
  Code,
  Quote,
  Equation,
  Callout,
  Embed,
  Bookmark,
  LinkPreview,
  SyncedBlock,
  SyncedFrom,
  Table,
  TableRow,
  TableCell,
  Toggle,
  ColumnList,
  Column,
  TableOfContents,
  RichText,
  Text,
  Annotation,
} from './interfaces'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('@notionhq/client')

const client = new Client({
  auth: NOTION_API_SECRET,
})

export async function getPosts(pageSize = 10) {
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

  const data: responses.QueryDatabaseResponse = await client.databases.query(params)

  return data.results
    .filter(item => _validPost(item))
    .map(item => _buildPost(item))
}

export async function getAllPosts() {
  let results = []

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
    const data: responses.QueryDatabaseResponse = await client.databases.query(params)

    results = results.concat(data.results)

    if (!data.has_more) {
      break
    }

    params['start_cursor'] = data.next_cursor
  }

  return results.filter(item => _validPost(item)).map(item => _buildPost(item))
}

export async function getRankedPosts(pageSize = 10) {
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

  const data: responses.QueryDatabaseResponse = await client.databases.query(params)

  return data.results
    .filter(item => _validPost(item))
    .map(item => _buildPost(item))
}

export async function getPostsBefore(date: string, pageSize = 10) {
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

  const data: responses.QueryDatabaseResponse = await client.databases.query(params)

  return data.results
    .filter(item => _validPost(item))
    .map(item => _buildPost(item))
}

export async function getFirstPost() {
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

  const data: responses.QueryDatabaseResponse = await client.databases.query(params)

  if (!data.results.length) {
    return null
  }

  if (!_validPost(data.results[0])) {
    return null
  }

  return _buildPost(data.results[0])
}

export async function getPostBySlug(slug: string) {
  const data: responses.QueryDatabaseResponse = await client.databases.query({
    database_id: DATABASE_ID,
    filter: _buildFilter([
      {
        property: 'Slug',
        rich_text: {
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

export async function getPostsByTag(tag: string | undefined, pageSize = 100) {
  if (!tag) return []

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

  const data: responses.QueryDatabaseResponse = await client.databases.query(params)

  return data.results
    .filter(item => _validPost(item))
    .map(item => _buildPost(item))
}

export async function getPostsByTagBefore(
  tag: string,
  date: string,
  pageSize = 100
) {
  const params = {
    database_id: DATABASE_ID,
    filter: _buildFilter([
      {
        property: 'Tags',
        multi_select: {
          contains: tag,
        },
      },
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

  const data: responses.QueryDatabaseResponse = await client.databases.query(params)

  return data.results
    .filter(item => _validPost(item))
    .map(item => _buildPost(item))
}

export async function getFirstPostByTag(tag: string) {
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
        direction: 'ascending',
      },
    ],
    page_size: 1,
  }

  const data: responses.QueryDatabaseResponse = await client.databases.query(params)

  if (!data.results.length) {
    return null
  }

  if (!_validPost(data.results[0])) {
    return null
  }

  return _buildPost(data.results[0])
}

export async function getAllBlocksByBlockId(blockId: string) {
  let allBlocks: Block[] = []

  const params = {
    block_id: blockId,
  }

  while (true) {
    const data: responses.RetrieveBlockChildrenResponse = await client.blocks.children.list(params)

    const blocks = data.results.map(item => _buildBlock(item))

    allBlocks = allBlocks.concat(blocks)

    if (!data.has_more) {
      break
    }

    params['start_cursor'] = data.next_cursor
  }

  for (let i = 0; i < allBlocks.length; i++) {
    const block = allBlocks[i]

    if (block.Type === 'table') {
      block.Table.Rows = await _getTableRows(block.Id)
    } else if (block.Type === 'column_list') {
      block.ColumnList.Columns = await _getColumns(block.Id)
    } else if (block.Type === 'bulleted_list_item' && block.HasChildren) {
      block.BulletedListItem.Children = await getAllBlocksByBlockId(block.Id)
    } else if (block.Type === 'numbered_list_item' && block.HasChildren) {
      block.NumberedListItem.Children = await getAllBlocksByBlockId(block.Id)
    } else if (block.Type === 'to_do' && block.HasChildren) {
      block.ToDo.Children = await getAllBlocksByBlockId(block.Id)
    } else if (block.Type === 'synced_block') {
      block.SyncedBlock.Children = await _getSyncedBlockChildren(block)
    } else if (block.Type === 'toggle') {
      block.Toggle.Children = await getAllBlocksByBlockId(block.Id)
    }
  }

  return allBlocks
}

function _buildBlock(item) {
  const block: Block = {
    Id: item.id,
    Type: item.type,
    HasChildren: item.has_children,
  }

  switch (item.type) {
    case 'paragraph':
      const paragraph: Paragraph = {
        RichTexts: item.paragraph.rich_text.map(_buildRichText),
        Color: item.paragraph.color,
      }

      block.Paragraph = paragraph
      break
    case 'heading_1':
      const heading1: Heading1 = {
        RichTexts: item.heading_1.rich_text.map(_buildRichText),
        Color: item.heading_1.color,
      }

      block.Heading1 = heading1
      break
    case 'heading_2':
      const heading2: Heading2 = {
        RichTexts: item.heading_2.rich_text.map(_buildRichText),
        Color: item.heading_2.color,
      }

      block.Heading2 = heading2
      break
    case 'heading_3':
      const heading3: Heading3 = {
        RichTexts: item.heading_3.rich_text.map(_buildRichText),
        Color: item.heading_3.color,
      }

      block.Heading3 = heading3
      break
    case 'bulleted_list_item':
      const bulletedListItem: BulletedListItem = {
        RichTexts: item.bulleted_list_item.rich_text.map(_buildRichText),
        Color: item.bulleted_list_item.color,
      }

      block.BulletedListItem = bulletedListItem
      break
    case 'numbered_list_item':
      const numberedListItem: NumberedListItem = {
        RichTexts: item.numbered_list_item.rich_text.map(_buildRichText),
        Color: item.numbered_list_item.color,
      }

      block.NumberedListItem = numberedListItem
      break
    case 'to_do':
      const toDo: ToDo = {
        RichTexts: item.to_do.rich_text.map(_buildRichText),
        Checked: item.to_do.checked,
        Color: item.to_do.color,
      }

      block.ToDo = toDo
      break
    case 'video':
      const video: Video = {
        Type: item.video.type,
      }

      if (item.video.type === 'external') {
        video.External = { Url: item.video.external.url }
      }

      block.Video = video
      break
    case 'image':
      const image: Image = {
        Caption: item.image.caption.map(_buildRichText),
        Type: item.image.type,
      }

      if (item.image.type === 'external') {
        image.External = { Url: item.image.external.url }
      } else {
        image.File = { Url: item.image.file.url, ExpiryTime: item.image.file.expiry_time }
      }

      block.Image = image
      break
    case 'code':
      const code: Code = {
        Caption: item[item.type].caption.map(_buildRichText),
        RichTexts: item[item.type].rich_text.map(_buildRichText),
        Language: item.code.language,
      }

      block.Code = code
      break
    case 'quote':
      const quote: Quote = {
        RichTexts: item[item.type].rich_text.map(_buildRichText),
        Color: item[item.type].color,
      }

      block.Quote = quote
      break
    case 'equation':
      const equation: Equation = {
        Expression: item[item.type].expression,
      }

      block.Equation = equation
      break
    case 'callout':
      const callout: Callout = {
        RichTexts: item[item.type].rich_text.map(_buildRichText),
        Icon: {
          Emoji: item[item.type].icon.emoji,
        },
        Color: item[item.type].color,
      }

      block.Callout = callout
      break
    case 'synced_block':
      let syncedFrom: SyncedFrom = null
      if (item[item.type].synced_from && item[item.type].synced_from.block_id) {
        syncedFrom = {
          BlockId: item[item.type].synced_from.block_id,
        }
      }

      const syncedBlock: SyncedBlock = {
        SyncedFrom: syncedFrom,
      }

      block.SyncedBlock = syncedBlock
      break
    case 'toggle':
      const toggle: Toggle = {
        RichTexts: item[item.type].rich_text.map(_buildRichText),
        Color: item[item.type].color,
        Children: [],
      }

      block.Toggle = toggle
      break
    case 'embed':
      const embed: Embed = {
        Url: item.embed.url,
      }

      block.Embed = embed
      break
    case 'bookmark':
      const bookmark: Bookmark = {
        Url: item.bookmark.url,
      }

      block.Bookmark = bookmark
      break
    case 'link_preview':
      const linkPreview: LinkPreview = {
        Url: item.link_preview.url,
      }

      block.LinkPreview = linkPreview
      break
    case 'table':
      const table: Table = {
        TableWidth: item.table.table_width,
        HasColumnHeader: item.table.has_column_header,
        HasRowHeader: item.table.has_row_header,
        Rows: [],
      }

      block.Table = table
      break
    case 'column_list':
      const columnList: ColumnList = {
        Columns: [],
      }

      block.ColumnList = columnList
      break
    case 'table_of_contents':
      const tableOfContents: TableOfContents = {
        Color: item.table_of_contents.color,
      }

      block.TableOfContents = tableOfContents
      break
  }

  return block
}

async function _getTableRows(blockId: string): Promise<TableRow[]> {
  let tableRows: TableRow[] = []

  const params = {
    block_id: blockId,
  }

  while (true) {
    const data: responses.RetrieveBlockChildrenResponse = await client.blocks.children.list(params)

    const blocks = data.results.map(item => {
      const tableRow: TableRow = {
        Id: item.id,
        Type: item.type,
        HasChildren: item.has_children,
        Cells: []
      }

      if (item.type === 'table_row') {
        const cells: TableCell[] = item.table_row.cells.map(cell => {
          const tableCell: TableCell = {
            RichTexts: cell.map(_buildRichText),
          }

          return tableCell
        })

        tableRow.Cells = cells
      }

      return tableRow
    })

    tableRows = tableRows.concat(blocks)

    if (!data.has_more) {
      break
    }

    params['start_cursor'] = data.next_cursor
  }

  return tableRows
}

async function _getColumns(blockId: string): Promise<Column[]> {
  let columns: Column[] = []

  const params = {
    block_id: blockId,
  }

  while (true) {
    const data: responses.RetrieveBlockChildrenResponse = await client.blocks.children.list(params)

    const blocks = await Promise.all(data.results.map(async item => {
      const children = await getAllBlocksByBlockId(item.id)

      const column: Column = {
        Id: item.id,
        Type: item.type,
        HasChildren: item.has_children,
        Children: children,
      }

      return column
    }))

    columns = columns.concat(blocks)

    if (!data.has_more) {
      break
    }

    params['start_cursor'] = data.next_cursor
  }

  return columns
}

async function _getSyncedBlockChildren(block: Block): Promise<Block[]> {
  let originalBlock: Block = block
  if (block.SyncedBlock.SyncedFrom && block.SyncedBlock.SyncedFrom.BlockId) {
    originalBlock = await _getBlock(block.SyncedBlock.SyncedFrom.BlockId)
  }

  const children = await getAllBlocksByBlockId(originalBlock.Id)
  return children
}

async function _getBlock(blockId: string): Promise<Block> {
  const data: responses.RetrieveBlockResponse = await client.blocks.retrieve({
    block_id: blockId,
  })

  return _buildBlock(data)
}

export async function getAllTags() {
  const data: responses.RetrieveDatabaseResponse = await client.databases.retrieve({
    database_id: DATABASE_ID,
  })
  return data.properties.Tags.multi_select.options
    .map(option => option.name)
    .sort()
}

export async function incrementLikes(post:Post) {
  const result = await client.pages.update({
    page_id: post.PageId,
    properties: {
      'Like': (post.Like || 0) + 1,
    },
  })

  if (!result) {
    return null
  }

  return _buildPost(result)
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
    if (properties.includes(cond.property)) {
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
    Like: prop.Like.number,
  }

  return post
}

function _buildRichText(item) {
  const annotation: Annotation = {
    Bold: item.annotations.bold,
    Italic: item.annotations.italic,
    Strikethrough: item.annotations.strikethrough,
    Underline: item.annotations.underline,
    Code: item.annotations.code,
    Color: item.annotations.color,
  }

  const richText: RichText = {
    Annotation: annotation,
    PlainText: item.plain_text,
    Href: item.href,
  }

  if (item.type === 'text') {
    const text: Text = {
      Content: item.text.content,
    }

    if (item.text.link) {
      text.Link = {
        Url: item.text.link.url,
      }
    }

    richText.Text = text
  } else if (item.type === 'equation') {
    const equation: Equation = {
      Expression: item.equation.expression,
    }
    richText.Equation = equation
  }

  return richText
}
