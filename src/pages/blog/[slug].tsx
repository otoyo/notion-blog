import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { NEXT_PUBLIC_URL } from '../../lib/notion/server-constants'
import DocumentHead from '../../components/document-head'
import {
  BlogPostLink,
  BlogTagLink,
  NoContents,
  PostBody,
  PostDate,
  PostTags,
  PostTitle,
  PostsNotFound,
} from '../../components/blog-parts'
import SocialButtons from '../../components/social-buttons'
import styles from '../../styles/blog.module.css'
import { getBlogLink } from '../../lib/blog-helpers'
import {
  getPosts,
  getRankedPosts,
  getPostBySlug,
  getPostsByTag,
  getAllTags,
  getAllBlocksByBlockId,
} from '../../lib/notion/client'

export async function getServerSideProps({ params: { slug } }) {
  const post = await getPostBySlug(slug)

  if (!post) {
    return { notFound: true }
  }

  const blocks = await getAllBlocksByBlockId(post.PageId)
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
  }
}

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
    return <PostsNotFound />
  }

  return (
    <div className={styles.container}>
      <DocumentHead
        title={post.Title}
        description={post.Excerpt}
        urlOgImage={post.OGImage}
      />

      <div className={styles.mainContent}>
        <div className={styles.post}>
          <PostDate post={post} />
          <PostTags post={post} />
          <PostTitle post={post} enableLink={false} />

          <NoContents contents={blocks} />
          <PostBody blocks={blocks} />

          <footer>
            {NEXT_PUBLIC_URL && (
              <SocialButtons
                title={post.Title}
                url={new URL(
                  getBlogLink(post.Slug),
                  NEXT_PUBLIC_URL
                ).toString()}
                id={post.Slug}
              />
            )}
          </footer>
        </div>
      </div>

      <div className={styles.subContent}>
        <BlogPostLink heading="同じカテゴリーの記事" posts={sameTagPosts} />
        <BlogPostLink heading="おすすめ記事" posts={rankedPosts} />
        <BlogPostLink heading="最新記事" posts={recentPosts} />
        <BlogTagLink heading="カテゴリー" tags={tags} />
      </div>
    </div>
  )
}

export default RenderPost
