import React from 'react'
import components from '../../components/dynamic'
import Heading from '../../components/heading'

function applyTags(tags = [], children, noPTag = false, key) {
  let child = children

  for (const tag of tags) {
    const props: { [key: string]: any } = { key }
    let tagName = tag[0]

    if (noPTag && tagName === 'p') tagName = React.Fragment
    if (tagName === 'a') {
      props.href = tag[1]
    }

    child = React.createElement(components[tagName] || tagName, props, child)
  }
  return child
}

export function renderBlocks(blocks) {
  let listTagName: string | null = null
  let listLastId: string | null = null
  let listMap: {
    [id: string]: {
      key: string
      isNested?: boolean
      nested: string[]
      children: React.ReactFragment
    }
  } = {}

  return blocks.map((block, blockIdx) => {
    const isLast = blockIdx === blocks.length - 1
    const isList =
      block.Type === 'bulleted_list_item' || block.Type === 'numbered_list_item'
    let toRender = []
    let richText

    if (!!block.RichTexts && block.RichTexts.length > 0) {
      richText = block.RichTexts[0]
    }

    if (isList) {
      listTagName =
        components[block.Type === 'bulleted_list_item' ? 'ul' : 'ol']
      listLastId = `list${block.Id}`

      listMap[block.Id] = {
        key: block.Id,
        nested: [],
        children: textBlock(block, true, block.Id),
      }
    }

    if (listTagName && (isLast || !isList)) {
      toRender.push(
        React.createElement(
          listTagName,
          { key: listLastId! },
          Object.keys(listMap).map(itemId => {
            if (listMap[itemId].isNested) return null

            const createEl = item =>
              React.createElement(
                components.li || 'ul',
                { key: item.key },
                item.children,
                item.nested.length > 0
                  ? React.createElement(
                      components.ul || 'ul',
                      { key: item + 'sub-list' },
                      item.nested.map(nestedId => createEl(listMap[nestedId]))
                    )
                  : null
              )
            return createEl(listMap[itemId])
          })
        )
      )
      listMap = {}
      listLastId = null
      listTagName = null
    }

    const renderHeading = (Type: string | React.ComponentType) => {
      if (!!richText) {
        toRender.push(
          React.createElement(
            Heading,
            { key: block.Id },
            React.createElement(
              Type,
              { key: block.Id },
              textBlock(block, true, block.Id)
            )
          )
        )
      }
    }

    switch (block.Type) {
      case 'paragraph':
        toRender.push(textBlock(block, false, block.Id))
        break
      case 'heading_1':
        renderHeading('h1')
        break
      case 'heading_2':
        renderHeading('h2')
        break
      case 'heading_3':
        renderHeading('h3')
        break
      case 'image':
        toRender.push(
          React.createElement('img', {
            src: block.Image.File.Url,
            alt: 'Please reload page to show this image.',
          })
        )
        if (
          block.Image.Caption.length > 0 &&
          block.Image.Caption[0].Text.Content
        ) {
          toRender.push(
            React.createElement(
              'div',
              { className: blogStyles.caption },
              block.Image.Caption[0].Text.Content
            )
          )
        }
        break
      case 'code':
        toRender.push(
          React.createElement(
            components.Code,
            { key: block.Id, language: block.Language || '' },
            block.Code.Text.map(richText => richText.Text.Content).join('')
          )
        )
        break
      case 'quote':
        toRender.push(
          React.createElement(
            components.blockquote,
            { key: block.Id },
            block.Quote.Text.map(richText => richText.Text.Content).join('')
          )
        )
        break
      default:
        if (
          process.env.NODE_ENV !== 'production' &&
          !(
            block.Type === 'bulleted_list_item' ||
            block.Type === 'numbered_list_item'
          )
        ) {
          console.log('unknown type', block.Type)
        }
        break
    }
    return toRender
  })
}

export function textBlock(block, noPTag, mainKey) {
  const children = []
  let key = 0

  if (block.RichTexts.length === 0) {
    return React.createElement(
      noPTag ? React.Fragment : components.p,
      { key: mainKey },
      ...children,
      noPTag
    )
  }

  for (const richText of block.RichTexts) {
    let tags = []
    key++

    if (richText.Annotation.Bold) {
      tags.push(['b'])
    }
    if (richText.Annotation.Italic) {
      tags.push(['i'])
    }
    if (richText.Annotation.Strikethrough) {
      tags.push(['strike'])
    }
    if (richText.Annotation.Underline) {
      tags.push(['u'])
    }
    if (richText.Annotation.Code) {
      tags.push(['code'])
    }
    if (!!richText.Href) {
      tags.push(['a', richText.Href])
    }

    children.push(applyTags(tags, richText.Text.Content, noPTag, key))
  }

  return React.createElement(
    noPTag ? React.Fragment : components.p,
    { key: mainKey },
    ...children,
    noPTag
  )
}
