import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Header from '../../components/header'
import SocialButtons from '../../components/social-buttons'
import blogStyles from '../../styles/blog.module.css'
import { getBlogLink, getTagLink } from '../../lib/blog-helpers'
import { renderBlocks } from '../../lib/notion/renderers'
import {
  getPosts,
  getAllPosts,
  getRankedPosts,
  getPostBySlug,
  getPostsByTag,
  getAllTags,
  getAllBlocksByPageId,
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
      revalidate: 30,
    }
  }

  const blocks = await getAllBlocksByPageId(post.PageId)
  const rankedPosts = await getRankedPosts()
  const recentPosts = await getPosts(5)
  const tags = await getAllTags()

  let sameTagPosts = []
  if (post.Tags.length > 0) {
    sameTagPosts = (await getPostsByTag(post.Tags[0], 6)).filter(
      p => p.Slug !== post.Slug
    )
  }

  return {
    props: {
      post,
      blocks,
      rankedPosts,
      recentPosts,
      sameTagPosts,
      tags,
    },
    revalidate: 60,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const posts = await getAllPosts()
  return {
    paths: posts.map(post => getBlogLink(post.Slug)),
    fallback: 'blocking',
  }
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const RenderPost = ({
  post,
  blocks = [],
  rankedPosts = [],
  recentPosts = [],
  sameTagPosts = [],
  tags = [],
  redirect,
}) => {
  const router = useRouter()

  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect)
    }
  }, [router, redirect, post])

  if (!post) {
    return (
      <div className={blogStyles.post}>
        <p>
          Woops! did not find the posts, redirecting you back to the blog index
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
        ogImageUrl={post.OGImage}
      />
      <div className={`${blogStyles.flexContainer}`}>
        <div className={blogStyles.post}>
          {post.Date && <div className="posted">📅&nbsp;&nbsp;{post.Date}</div>}
          <h1>{post.Title || ''}</h1>
          <hr />
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

          {blocks.length === 0 && <p>This post has no content</p>}
          {renderBlocks(blocks)}
          <div>
            <SocialButtons
              title={post.Title}
              url={'https://alpacat.com' + getBlogLink(post.Slug)}
              id={post.Slug}
            />
          </div>
        </div>
        <div className={blogStyles.sideMenu}>
          <h3>同じカテゴリーの記事</h3>
          <hr />

          {sameTagPosts.length === 0 && (
            <div className={blogStyles.noContents}>There are no posts yet</div>
          )}
          {sameTagPosts.length > 0 && (
            <ul>
              {sameTagPosts.map(sameTagPost => {
                return (
                  <li key={sameTagPost.Slug}>
                    <Link
                      href="/blog/[slug]"
                      as={getBlogLink(sameTagPost.Slug)}
                      passHref
                    >
                      <a>{sameTagPost.Title}</a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
          <h3>おすすめ記事</h3>
          <hr />

          {rankedPosts.length === 0 && (
            <div className={blogStyles.noContents}>There are no posts yet</div>
          )}
          {rankedPosts.length > 0 && (
            <ul>
              {rankedPosts.map(rankedPost => {
                return (
                  <li key={rankedPost.Slug}>
                    <Link
                      href="/blog/[slug]"
                      as={getBlogLink(rankedPost.Slug)}
                      passHref
                    >
                      <a>{rankedPost.Title}</a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
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
      </div>
    </>
  )
}

export default RenderPost
