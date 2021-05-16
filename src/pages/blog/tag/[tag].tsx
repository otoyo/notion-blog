import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../../components/header'

import blogStyles from '../../../styles/blog.module.css'
import sharedStyles from '../../../styles/shared.module.css'

import { getBlogLink, getTagLink } from '../../../lib/blog-helpers'
import { textBlock } from '../../../lib/notion/renderers'
import { useEffect } from 'react'
import { getPostsByTag, getAllTags } from '../../../lib/notion/client'

export async function getStaticProps({ params: { tag } }) {
  const posts = await getPostsByTag(tag)
  const tags = await getAllTags()

  if (posts.length === 0) {
    console.log(`Failed to find posts for tag: ${tag}`)
    return {
      props: {
        redirect: '/blog',
      },
      unstable_revalidate: 30,
    }
  }

  return {
    props: {
      posts,
      tags,
      tag,
    },
    unstable_revalidate: 60,
  }
}

// Return our list of tags to prerender
export async function getStaticPaths() {
  const tags = await getAllTags()

  return {
    paths: tags.map(tag => getTagLink(tag)),
    fallback: true,
  }
}

export default ({ tag, posts = [], tags = [], redirect }) => {
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
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h2>{tag}</h2>
        {posts.length === 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
        {posts.map(post => {
          return (
            <div className={blogStyles.postPreview} key={post.Slug}>
              {post.Date && (
                <div className="posted">📅&nbsp;&nbsp;{post.Date}</div>
              )}
              <h3>
                <div className={blogStyles.titleContainer}>
                  <Link
                    href="/blog/[slug]"
                    as={getBlogLink(post.Slug)}
                    passHref
                  >
                    <a>{post.Title}</a>
                  </Link>
                </div>
              </h3>
              <div className={blogStyles.tagContainer}>
                {post.Tags &&
                  post.Tags.length > 0 &&
                  post.Tags.map(tag => (
                    <Link
                      href="/blog/tag/[tag]"
                      as={getTagLink(tag)}
                      key={`${post.Slug}-${tag}`}
                      passHref
                    >
                      <a className={blogStyles.tag}>🔖&nbsp;&nbsp;{tag}</a>
                    </Link>
                  ))}
              </div>
              <p>{post.Excerpt}</p>
              <Link href="/blog/[slug]" as={getBlogLink(post.Slug)} passHref>
                <a className={blogStyles.expandButton}>続きを読む</a>
              </Link>
            </div>
          )
        })}
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
