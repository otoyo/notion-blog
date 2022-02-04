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
import { getTagLink } from '../../../lib/blog-helpers'
import { useEffect } from 'react'
import {
  getPosts,
  getRankedPosts,
  getPostsByTag,
  getAllTags,
} from '../../../lib/notion/client'

export async function getStaticProps({ params: { tag } }) {
  const posts = await getPostsByTag(tag)
  const rankedPosts = await getRankedPosts()
  const recentPosts = await getPosts(5)
  const tags = await getAllTags()

  if (posts.length === 0) {
    console.log(`Failed to find posts for tag: ${tag}`)
    return {
      props: {
        redirect: '/blog',
      },
      revalidate: 30,
    }
  }

  return {
    props: {
      posts,
      rankedPosts,
      recentPosts,
      tags,
      tag,
    },
    revalidate: 600,
  }
}

export async function getStaticPaths() {
  const tags = await getAllTags()

  return {
    paths: tags.map(tag => getTagLink(tag)),
    fallback: 'blocking',
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
      <DocumentHead
        title={`${tag}を含む記事`}
        description={`${tag}を含む記事`}
      />

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
