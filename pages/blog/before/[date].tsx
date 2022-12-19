import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { NUMBER_OF_POSTS_PER_PAGE } from '../../../lib/notion/server-constants'
import DocumentHead from '../../../components/document-head'
import {
  BlogPostLink,
  BlogTagLink,
  NextPageLink,
  NoContents,
  PostDate,
  PostThumbnail,
  PostExcerpt,
  PostTags,
  PostTitle,
  PostsNotFound,
  ReadMoreLink,
} from '../../../components/blog-parts'
import styles from '../../../styles/blog.module.css'

import {
  getRankedPosts,
  getPopularPosts,
  getPostsBefore,
  getFirstPost,
  getAllTags,
} from '../../../lib/notion/client'

export async function getServerSideProps({ params: { date } }) {
  if (!Date.parse(date) || !/\d{4}-\d{2}-\d{2}/.test(date)) {
    return { notFound: true }
  }

  const [posts, firstPost, rankedPosts, popularPosts, tags] = await Promise.all([
    getPostsBefore(date, NUMBER_OF_POSTS_PER_PAGE),
    getFirstPost(),
    getRankedPosts(),
    getPopularPosts(5),
    getAllTags(),
  ])

  return {
    props: {
      date,
      posts,
      firstPost,
      rankedPosts,
      popularPosts,
      tags,
    },
  }
}

const RenderPostsBeforeDate = ({
  date,
  posts = [],
  firstPost,
  rankedPosts = [],
  popularPosts = [],
  tags = [],
  redirect,
}) => {
  const router = useRouter()

  useEffect(() => {
    if (redirect && !posts) {
      router.replace(redirect)
    }
  }, [router, redirect, posts])

  if (!posts) {
    return <PostsNotFound />
  }

  return (
    <div className={styles.container}>
      <DocumentHead description={`${date.split('T')[0]}より前の記事`} />

      <div className={styles.mainContent}>
        <header>
          <h2>{date.split('T')[0]}より前の記事</h2>
        </header>

        <NoContents contents={posts} />

        {posts.map(post => {
          return (
            <div className={styles.post} key={post.Slug}>
              <PostDate post={post} />
              <PostTags post={post} />
              <PostTitle post={post} />
              {post.OGImage ? <PostThumbnail post={post} /> : null}
              <PostExcerpt post={post} />
              <ReadMoreLink post={post} />
            </div>
          )
        })}

        <footer>
          <NextPageLink firstPost={firstPost} posts={posts} />
        </footer>
      </div>

      <div className={styles.subContent}>
        <BlogPostLink heading="おすすめ記事" posts={rankedPosts} />
        <BlogPostLink heading="人気の記事" posts={popularPosts} />
        <BlogTagLink heading="カテゴリー" tags={tags} />
      </div>
    </div>
  )
}

export default RenderPostsBeforeDate
