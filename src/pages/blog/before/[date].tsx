import { NUMBER_OF_POSTS_PER_PAGE } from '../../../lib/notion/server-constants'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import Header from '../../../components/header'

import blogStyles from '../../../styles/blog.module.css'
import sharedStyles from '../../../styles/shared.module.css'

import {
  getBlogLink,
  getTagLink,
  getBeforeLink,
} from '../../../lib/blog-helpers'
import {
  getAllPosts,
  getPostsBefore,
  getFirstPost,
  getAllTags,
} from '../../../lib/notion/client'

export async function getStaticProps({ params: { date } }) {
  const posts = await getPostsBefore(date, NUMBER_OF_POSTS_PER_PAGE)
  const firstPost = await getFirstPost()
  const tags = await getAllTags()

  return {
    props: {
      date,
      posts,
      firstPost,
      tags,
    },
    unstable_revalidate: 60,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const posts = await getAllPosts()

  let dates = []
  posts.forEach((post, i) => {
    if (i % NUMBER_OF_POSTS_PER_PAGE === NUMBER_OF_POSTS_PER_PAGE - 1) {
      let lastPostPerPage = posts[i]
      dates.push(lastPostPerPage.Date)
    }
  })

  // we fallback for any unpublished posts to save build time
  // for actually published ones
  return {
    paths: dates.map(date => getBeforeLink(date)),
    fallback: true,
  }
}

export default ({ date, posts = [], firstPost, tags = [], redirect }) => {
  const router = useRouter()

  useEffect(() => {
    if (redirect && !posts) {
      router.replace(redirect)
    }
  }, [redirect, posts])

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // if you don't have a post at this point, and are not
  // loading one from fallback then  redirect back to the index
  if (!posts) {
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
        path={getBeforeLink(date)}
        titlePre={`${date}より前の記事`}
        description={`${date}より前の記事`}
      />
      <div className={`${blogStyles.flexContainer}`}>
        <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
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
          {firstPost.Date !== posts[posts.length - 1].Date && (
            <div className={blogStyles.nextContainer}>
              <hr />
              <Link
                href="/blog/before/[date]"
                as={getBeforeLink(posts[posts.length - 1].Date)}
                passHref
              >
                <a className={blogStyles.nextButton}>次のページ ＞</a>
              </Link>
            </div>
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
      </div>
    </>
  )
}
