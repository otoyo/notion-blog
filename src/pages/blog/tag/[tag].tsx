import { useRouter } from 'next/router'

import DocumentHead from '../../../components/document-head'
import {
  BlogPostLink,
  BlogTagLink,
  NoContents,
  PostDate,
  PostExcerpt,
  PostTags,
  PostTitle,
  PostsNotFound,
  ReadMoreLink,
} from '../../../components/blog-parts'
import styles from '../../../styles/blog.module.css'
import { useEffect } from 'react'
import {
  getPosts,
  getRankedPosts,
  getPostsByTag,
  getAllTags,
} from '../../../lib/notion/client'

export async function getServerSideProps({ res, params: { tag } }) {
  const tags = await getAllTags()

  if (!tags.includes(tag)) {
    return { notFound: true }
  }

  const posts = await getPostsByTag(tag)

  if (posts.length === 0) {
    return { notFound: true }
  }

  const rankedPosts = await getRankedPosts()
  const recentPosts = await getPosts(5)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=900, stale-while-revalidate=86400'
  )

  return {
    props: {
      posts,
      rankedPosts,
      recentPosts,
      tags,
      tag,
    },
  }
}

const RenderPostsByTags = ({
  tag,
  posts = [],
  rankedPosts,
  recentPosts = [],
  tags = [],
  redirect,
}) => {
  const router = useRouter()

  useEffect(() => {
    if (redirect && posts.length === 0) {
      router.replace(redirect)
    }
  }, [router, redirect, posts])

  if (!posts) {
    return <PostsNotFound />
  }

  return (
    <div className={styles.container}>
      <DocumentHead description={`${tag}を含む記事`} />

      <div className={styles.mainContent}>
        <header>
          <h2>{tag}</h2>
        </header>

        <NoContents contents={posts} />

        {posts.map(post => {
          return (
            <div className={styles.post} key={post.Slug}>
              <PostDate post={post} />
              <PostTags post={post} />
              <PostTitle post={post} />
              <PostExcerpt post={post} />
              <ReadMoreLink post={post} />
            </div>
          )
        })}
      </div>

      <div className={styles.subContent}>
        <BlogPostLink heading="おすすめ記事" posts={rankedPosts} />
        <BlogPostLink heading="最新記事" posts={recentPosts} />
        <BlogTagLink heading="カテゴリー" tags={tags} />
      </div>
    </div>
  )
}

export default RenderPostsByTags
