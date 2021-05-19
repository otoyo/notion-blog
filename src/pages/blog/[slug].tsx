import Link from 'next/link'
import fetch from 'node-fetch'
import { useRouter } from 'next/router'
import Header from '../../components/header'
import Heading from '../../components/heading'
import Share from '../../components/share'
import components from '../../components/dynamic'
import ReactJSXParser from '@zeit/react-jsx-parser'
import blogStyles from '../../styles/blog.module.css'
import getPageData from '../../lib/notion/getPageData'
import React, { CSSProperties, useEffect } from 'react'

import { getBlogLink, getTagLink } from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import {
  getPosts,
  getAllPosts,
  getPostBySlug,
  getAllTags,
} from '../../lib/notion/client'

// Get the data for each blog post
export async function getStaticProps({ params: { slug } }) {
  const post = await getPostBySlug(slug)

  if (!post) {
    console.log(`Failed to find post for slug: ${slug}`)
    return {
      props: {
        redirect: '/blog',
      },
      unstable_revalidate: 30,
    }
  }

  const postData = await getPageData(post.PageId)
  post['content'] = postData.blocks

  const recentPosts = await getPosts(5)
  const tags = await getAllTags()

  return {
    props: {
      post,
      recentPosts,
      tags,
    },
    unstable_revalidate: 60,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const posts = await getAllPosts()
  // we fallback for any unpublished posts to save build time
  // for actually published ones
  return {
    paths: posts.map(post => getBlogLink(post.Slug)),
    fallback: true,
  }
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const RenderPost = ({ post, recentPosts = [], tags = [], redirect }) => {
  const router = useRouter()

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

  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect)
    }
  }, [redirect, post])

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!post) {
    return (
      <div className={blogStyles.post}>
        <p>
          Woops! didn't find that post, redirecting you back to the blog index
        </p>
      </div>
    )
  }

  return (
    <>
      <Header
        path={`/blog/${post.Slug}`}
        titlePre={post.Title}
        description={post.Excerpt}
        ogImageUrl={
          !post.OGImage
            ? ''
            : `https://alpacat.com/api/asset?assetUrl=${encodeURIComponent(
                post.OGImage
              )}&blockId=${post.PageId}`
        }
      />
      <div className={blogStyles.post}>
        {post.Date && <div className="posted">📅&nbsp;&nbsp;{post.Date}</div>}
        <h1>{post.Title || ''}</h1>
        <div className={blogStyles.tagContainer}>
          {post.Tags &&
            post.Tags.length > 0 &&
            post.Tags.map(tag => (
              <Link
                href="/blog/tag/[tag]"
                as={getTagLink(tag)}
                key={tag}
                passHref
              >
                <a className={blogStyles.tag}>🔖&nbsp;&nbsp;{tag}</a>
              </Link>
            ))}
        </div>
        <hr />

        {(!post.content || post.content.length === 0) && (
          <p>This post has no content</p>
        )}

        {(post.content || []).map((block, blockIdx) => {
          const { value } = block
          const { type, properties, id, parent_id } = value
          const isLast = blockIdx === post.content.length - 1
          const isList = listTypes.has(type)
          let toRender = []

          if (isList) {
            listTagName = components[type === 'bulleted_list' ? 'ul' : 'ol']
            listLastId = `list${id}`

            listMap[id] = {
              key: id,
              nested: [],
              children: textBlock(properties.title, true, id),
            }

            if (listMap[parent_id]) {
              listMap[id].isNested = true
              listMap[parent_id].nested.push(id)
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
                            item.nested.map(nestedId =>
                              createEl(listMap[nestedId])
                            )
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
            toRender.push(
              <Heading key={id}>
                <Type key={id}>{textBlock(properties.title, true, id)}</Type>
              </Heading>
            )
          }

          switch (type) {
            case 'page':
            case 'divider':
              break
            case 'text':
              if (properties) {
                toRender.push(textBlock(properties.title, false, id))
              } else {
                toRender.push(textBlock([['']], false, id))
              }
              break
            case 'image':
            case 'video':
            case 'embed': {
              const { format = {} } = value
              const {
                block_width,
                block_height,
                display_source,
                properties: image_properties,
                block_aspect_ratio,
              } = format
              const baseBlockWidth = 768
              const roundFactor = Math.pow(10, 2)
              // calculate percentages
              const width = block_width
                ? `${Math.round(
                    (block_width / baseBlockWidth) * 100 * roundFactor
                  ) / roundFactor}%`
                : block_height || '100%'

              const isImage = type === 'image'
              const Comp = isImage ? 'img' : 'video'
              const useWrapper = block_aspect_ratio && !block_height
              const childStyle: CSSProperties = useWrapper
                ? {
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                  }
                : {
                    width,
                    border: 'none',
                    height: block_height,
                    display: 'block',
                    maxWidth: '100%',
                  }
              const caption = properties.caption || ''

              let child = null

              if (!isImage && !value.file_ids) {
                // external resource use iframe
                child = (
                  <iframe
                    style={childStyle}
                    src={display_source}
                    key={!useWrapper ? id : undefined}
                    className={!useWrapper ? 'asset-wrapper' : undefined}
                  />
                )
              } else {
                // notion resource
                child = (
                  <Comp
                    key={!useWrapper ? id : undefined}
                    src={`/api/asset?assetUrl=${encodeURIComponent(
                      properties.source[0][0] as string
                    )}&blockId=${id}`}
                    controls={!isImage}
                    alt={`An ${isImage ? 'image' : 'video'} from Notion`}
                    loop={!isImage}
                    muted={!isImage}
                    autoPlay={!isImage}
                    style={childStyle}
                  />
                )
              }

              toRender.push(
                useWrapper ? (
                  <div
                    style={{
                      paddingTop: `${Math.round(block_aspect_ratio * 100)}%`,
                      position: 'relative',
                    }}
                    className="asset-wrapper"
                    key={id}
                  >
                    {child}
                  </div>
                ) : (
                  child
                )
              )
              if (caption != '') {
                toRender.push(
                  <div className={blogStyles.caption}>{caption}</div>
                )
              }
              break
            }
            case 'header':
              renderHeading('h1')
              break
            case 'sub_header':
              renderHeading('h2')
              break
            case 'sub_sub_header':
              renderHeading('h3')
              break
            case 'code': {
              if (properties.title) {
                const content = properties.title[0][0]
                const language = properties.language[0][0]

                if (language === 'LiveScript') {
                  // this requires the DOM for now
                  toRender.push(
                    <ReactJSXParser
                      key={id}
                      jsx={content}
                      components={components}
                      componentsOnly={false}
                      renderInpost={false}
                      allowUnknownElements={true}
                      blacklistedTags={['script', 'style']}
                    />
                  )
                } else {
                  toRender.push(
                    <components.Code key={id} language={language || ''}>
                      {content}
                    </components.Code>
                  )
                }
              }
              break
            }
            case 'quote': {
              if (properties.title) {
                toRender.push(
                  React.createElement(
                    components.blockquote,
                    { key: id },
                    properties.title
                  )
                )
              }
              break
            }
            case 'callout': {
              toRender.push(
                <div className="callout" key={id}>
                  {value.format?.page_icon && (
                    <div>{value.format?.page_icon}</div>
                  )}
                  <div className="text">
                    {textBlock(properties.title, true, id)}
                  </div>
                </div>
              )
              break
            }
            case 'tweet': {
              if (properties.html) {
                toRender.push(
                  <div
                    dangerouslySetInnerHTML={{ __html: properties.html }}
                    key={id}
                  />
                )
              }
              break
            }
            case 'equation': {
              if (properties && properties.title) {
                const content = properties.title[0][0]
                toRender.push(
                  <components.Equation key={id} displayMode={true}>
                    {content}
                  </components.Equation>
                )
              }
              break
            }
            default:
              if (
                process.env.NODE_ENV !== 'production' &&
                !listTypes.has(type)
              ) {
                console.log('unknown type', type)
              }
              break
          }
          return toRender
        })}
        <div>
          <Share
            text={post.Title}
            url={'https://alpacat.com' + getBlogLink(post.Slug)}
          />
        </div>
      </div>
      <div className={blogStyles.sideMenu}>
        <h3>最新記事</h3>
        <hr />

        {recentPosts.length === 0 && (
          <div className={blogStyles.noContents}>There are no posts yet</div>
        )}
        {recentPosts.length > 0 && (
          <ul>
            {recentPosts.map(recentPost => {
              return (
                <li key={recentPost.Slug}>
                  <Link
                    href="/blog/[slug]"
                    as={getBlogLink(recentPost.Slug)}
                    passHref
                  >
                    <a>{recentPost.Title}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className={blogStyles.sideMenu}>
        <h3>カテゴリー</h3>
        <hr />

        {tags.length === 0 && (
          <div className={blogStyles.noContents}>There are no tags yet</div>
        )}
        {tags.length > 0 && (
          <ul>
            {tags.map(tag => {
              return (
                <li key={tag}>
                  <Link href="/blog/tag/[tag]" as={getTagLink(tag)} passHref>
                    <a>{tag}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}

export default RenderPost
