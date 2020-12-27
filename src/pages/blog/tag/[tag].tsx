import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../../components/header'

import blogStyles from '../../../styles/blog.module.css'
import sharedStyles from '../../../styles/shared.module.css'

import {
  getBlogLink,
  getTagLink,
  getDateStr,
  postIsPublished,
} from '../../../lib/blog-helpers'
import { textBlock } from '../../../lib/notion/renderers'
import { useEffect } from 'react'
import getNotionUsers from '../../../lib/notion/getNotionUsers'
import getBlogIndex from '../../../lib/notion/getBlogIndex'

export async function getStaticProps({ params: { tag }, preview }) {
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!preview && !postIsPublished(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      if (post.Tags.indexOf(tag) === -1) {
        return null
      }
      return post
    })
    .filter(Boolean)

  if (posts.length === 0) {
    console.log(`Failed to find posts for tag: ${tag}`)
    return {
      props: {
        redirect: '/blog',
        preview: false,
      },
      unstable_revalidate: 5,
    }
  }

  const tags: string[] = Object.keys(postsTable)
    .filter(slug => postIsPublished(postsTable[slug]))
    .map(slug => postsTable[slug].Tags)
    .flat()
    .filter((tag, index, self) => self.indexOf(tag) === index)

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map(post => {
    post.Authors = post.Authors.map(id => users[id].full_name)
  })

  return {
    props: {
      preview: preview || false,
      posts,
      tags,
      tag,
    },
    unstable_revalidate: 10,
  }
}

// Return our list of tags to prerender
export async function getStaticPaths() {
  const postsTable = await getBlogIndex()

  return {
    paths: Object.keys(postsTable)
      .filter(slug => postIsPublished(postsTable[slug]))
      .map(slug => postsTable[slug].Tags)
      .flat()
      .filter((tag, index, self) => self.indexOf(tag) === index)
      .map(tag => getTagLink(tag)),
    fallback: true,
  }
}

export default ({ tag, posts = [], tags = [], redirect, preview }) => {
  const router = useRouter()

  useEffect(() => {
    if (redirect && posts.length === 0) {
      router.replace(redirect)
    }
  }, [redirect, posts])

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // if you don't have any posts at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (posts.length === 0) {
    return (
      <div className={blogStyles.post}>
        <p>
          Woops! didn't find any posts, redirecting you back to the blog index
        </p>
      </div>
    )
  }

  return (
    <>
      <Header titlePre={`${tag}を含む記事`} />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h2>{tag}</h2>
        {posts.length === 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
        {posts.map(post => {
          return (
            <div className={blogStyles.postPreview} key={post.Slug}>
              <h3>
                <div className={blogStyles.titleContainer}>
                  {!post.Published && (
                    <span className={blogStyles.draftBadge}>Draft</span>
                  )}
                  <Link
                    href="/blog/[slug]"
                    as={getBlogLink(post.Slug)}
                    passHref
                  >
                    <a>{post.Page}</a>
                  </Link>
                </div>
              </h3>
              {post.Authors.length > 0 && (
                <div className="authors">By: {post.Authors.join(' ')}</div>
              )}
              {post.Date && (
                <div className="posted">{getDateStr(post.Date)}</div>
              )}
              {post.Tags &&
                post.Tags.length > 0 &&
                post.Tags.map(tag => (
                  <Link
                    href="/blog/tag/[tag]"
                    as={getTagLink(tag)}
                    key={`${post.Slug}-${tag}`}
                    passHref
                  >
                    <a className={blogStyles.tag}>🔖{tag}</a>
                  </Link>
                ))}
              <p>
                {(!post.preview || post.preview.length === 0) &&
                  'No preview available'}
                {(post.preview || []).map((block, idx) =>
                  textBlock(block, true, `${post.Slug}${idx}`)
                )}
              </p>
            </div>
          )
        })}
      </div>
      <div className={blogStyles.tagIndex}>
        <h3>タグ</h3>
        {tags.length === 0 && (
          <div className={blogStyles.noTags}>There are no tags yet</div>
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
