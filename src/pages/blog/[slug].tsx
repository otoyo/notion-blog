import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { NEXT_PUBLIC_URL } from '../../lib/notion/server-constants'
import { Post } from '../../lib/notion/interfaces'
import DocumentHead from '../../components/document-head'
import {
  BlogPostLink,
  BlogTagLink,
  NoContents,
  PostBody,
  PostDate,
  PostFooter,
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

  const [
    blocks,
    rankedPosts,
    recentPosts,
    sameTagPosts,
    tags,
  ] = await Promise.all([
    getAllBlocksByBlockId(post.PageId),
    getRankedPosts(),
    getPosts(5),
    getPostsByTag(post.Tags[0], 6),
    getAllTags(),
  ])

  return {
    props: {
      post,
      blocks,
      rankedPosts,
      recentPosts,
      tags,
      sameTagPosts: sameTagPosts.filter((p: Post) => p.Slug !== post.Slug),
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
        urlOgImage={NEXT_PUBLIC_URL && post.OGImage && new URL(`/api/og-image/${post.Slug}`, NEXT_PUBLIC_URL).toString()}
      />

      <div className={styles.mainContent}>
        <div className={styles.post}>
          <PostDate post={post} />
          <PostTags post={post} />
          <PostTitle post={post} enableLink={false} />

          <NoContents contents={blocks} />
          <PostBody blocks={blocks} />

          <footer>
            <PostFooter />
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
