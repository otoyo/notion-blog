import React from 'react'
import dynamic from 'next/dynamic'

const Code = dynamic(() => import('./notion-blocks/code'))
const Embed = dynamic(() => import('./notion-blocks/embed'))
const Bookmark = dynamic(() => import('./notion-blocks/bookmark'))

import styles from '../styles/notion-block.module.css'

const RichText = ({ richText }) => {
  let element = richText.Text.Content

  if (richText.Annotation.Bold) {
    element = <b>{element}</b>
  }
  if (richText.Annotation.Italic) {
    element = <i>{element}</i>
  }
  if (richText.Annotation.Strikethrough) {
    element = <s>{element}</s>
  }
  if (richText.Annotation.Underline) {
    element = <u>{element}</u>
  }
  if (richText.Annotation.Code) {
    element = <code>{element}</code>
  }
  if (richText.Href) {
    element = <a href={richText.Href}>{element}</a>
  }

  return element
}

const Paragraph = ({ block }) => (
  <p>
    {block.RichTexts.map((richText, i) => (
      <RichText richText={richText} key={`paragraph-${block.Id}-${i}`} />
    ))}
  </p>
)

const Heading = ({ block, level = 1 }) => {
  const tag = `h${level + 3}`
  const id = block.RichTexts.map(richText => richText.Text.Content)
    .join()
    .trim()
  const heading = React.createElement(
    tag,
    {},
    block.RichTexts.map(richText => <RichText richText={richText} key={id} />)
  )

  return (
    <a href={`#${id}`} id={id}>
      {heading}
    </a>
  )
}

const ImageBlock = ({ block }) => (
  <figure className={styles.image}>
    <div>
      <img
        src={
          block.Image.External ? block.Image.External.Url : block.Image.File.Url
        }
        alt="画像が読み込まれない場合はページを更新してみてください。"
      />
    </div>
    {block.Image.Caption.length > 0 && block.Image.Caption[0].Text.Content ? (
      <figcaption className={styles.caption}>
        {block.Image.Caption[0].Text.Content}
      </figcaption>
    ) : null}
  </figure>
)

const Quote = ({ block }) => (
  <blockquote>
    {block.Quote.Text.map((richText, i) => (
      <RichText richText={richText} key={`quote-${block.Id}-${i}`} />
    ))}
  </blockquote>
)

const Callout = ({ block }) => (
  <div className={styles.callout}>
    <div>{block.Callout.Icon.Emoji}</div>
    <div>
      {block.Callout.RichTexts.map((richText, i) => (
        <RichText richText={richText} key={`callout-${block.Id}-${i}`} />
      ))}
    </div>
  </div>
)

const Table = ({ block }) => (
  <table>
    <tbody>
      {block.Table.Rows.map((rowBlock, j) => {
        return (
          <tr key={`${rowBlock.Id}-${j}`}>
            {rowBlock.TableRow.Cells.map((cell, i) => {
              let tag = 'td'
              if (
                (block.Table.HasRowHeader && i === 0) ||
                (block.Table.HasColumnHeader && j === 0)
              ) {
                tag = 'th'
              }

              return React.createElement(
                tag,
                { key: `${rowBlock.Id}-${j}-${i}` },
                cell.RichTexts.map((richText, k) => (
                  <RichText richText={richText} key={`${cell.Id}-${k}`} />
                ))
              )
            })}
          </tr>
        )
      })}
    </tbody>
  </table>
)

const List = ({ block }) => {
  if (block.Type === 'bulleted_list') {
    return (
      <ul>
        <BulletedListItems blocks={block.ListItems} />
      </ul>
    )
  }
  return (
    <ol>
      <NumberedListItems blocks={block.ListItems} />
    </ol>
  )
}

const BulletedListItems = ({ blocks }) =>
  blocks
    .filter(b => b.Type === 'bulleted_list_item')
    .map(listItem => (
      <li key={`bulleted-list-item-${listItem.Id}`}>
        {listItem.RichTexts.map((richText, i) => (
          <RichText
            richText={richText}
            key={`bulleted-list-item-${listItem.Id}-${i}`}
          />
        ))}
        {listItem.HasChildren ? (
          <ul>
            <BulletedListItems blocks={listItem.Children} />
          </ul>
        ) : null}
      </li>
    ))

const NumberedListItems = ({ blocks, level = 1 }) =>
  blocks
    .filter(b => b.Type === 'numbered_list_item')
    .map(listItem => (
      <li key={`numbered-list-item-${listItem.Id}`}>
        {listItem.RichTexts.map((richText, i) => (
          <RichText
            richText={richText}
            key={`numbered-list-item-${listItem.Id}-${i}`}
          />
        ))}
        {listItem.HasChildren ? (
          level % 3 === 0 ? (
            <ol type="1">
              <NumberedListItems blocks={listItem.Children} level={level + 1} />
            </ol>
          ) : level % 3 === 1 ? (
            <ol type="a">
              <NumberedListItems blocks={listItem.Children} level={level + 1} />
            </ol>
          ) : (
            <ol type="i">
              <NumberedListItems blocks={listItem.Children} level={level + 1} />
            </ol>
          )
        ) : null}
      </li>
    ))

const NotionBlock = ({ block }) => {
  if (block.Type === 'paragraph') {
    return <Paragraph block={block} />
  } else if (block.Type === 'heading_1') {
    return <Heading block={block} level={1} />
  } else if (block.Type === 'heading_2') {
    return <Heading block={block} level={2} />
  } else if (block.Type === 'heading_3') {
    return <Heading block={block} level={3} />
  } else if (block.Type === 'image') {
    return <ImageBlock block={block} />
  } else if (block.Type === 'code') {
    return <Code block={block} />
  } else if (block.Type === 'quote') {
    return <Quote block={block} />
  } else if (block.Type === 'callout') {
    return <Callout block={block} />
  } else if (block.Type === 'embed') {
    return <Embed block={block} />
  } else if (block.Type === 'bookmark' || block.Type === 'link_preview') {
    return <Bookmark block={block} />
  } else if (block.Type === 'divider') {
    return <hr className="divider" />
  } else if (block.Type === 'table') {
    return <Table block={block} />
  } else if (block.Type === 'bulleted_list' || block.Type === 'numbered_list') {
    return <List block={block} />
  }

  return null
}

export default NotionBlock
