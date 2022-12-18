import { redirect } from 'next/navigation'
import { NEXT_PUBLIC_URL } from '../../server-constants'
import { Post } from '../../../lib/notion/interfaces'
import GoogleAnalytics from '../../../components/google-analytics'
import {
  BlogPostLink,
  BlogTagLink,
  NoContents,
  PostBody,
  PostDate,
  PostTags,
  PostTitle,
} from '../../../components/blog-parts'
import SocialButtons from '../../../components/social-buttons'
import styles from '../../../styles/blog.module.css'
import { getBlogLink } from '../../../lib/blog-helpers'
import {
  getPosts,
  getRankedPosts,
  getPopularPosts,
  getPostBySlug,
  getPostsByTag,
  getAllTags,
  getAllBlocksByBlockId,
} from '../../../lib/notion/client'

const BlogSlugPage = async ({ params: { slug } }) => {
  const post = await getPostBySlug(slug)

  if (!post) {
    console.log(`Failed to find post for slug: ${slug}`)
    redirect('/blog')
  }

  const [
    blocks,
    rankedPosts,
    popularPosts,
    recentPosts,
    tags,
    sameTagPosts,
  ] = await Promise.all([
    getAllBlocksByBlockId(post.PageId),
    getRankedPosts(),
    getPopularPosts(5),
    getPosts(5),
    getAllTags(),
    getPostsByTag(post.Tags[0], 6),
  ])

  const otherPostsHavingSameTag = sameTagPosts.filter((p: Post) => p.Slug !== post.Slug)

  return (
    <>
      <GoogleAnalytics pageTitle={post.Title} />
      <div className={styles.container}>
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
          <BlogPostLink
            heading="同じカテゴリーの記事"
            posts={otherPostsHavingSameTag}
          />
          <BlogPostLink heading="おすすめ記事" posts={rankedPosts} />
          <BlogPostLink heading="人気の記事" posts={popularPosts} />
          <BlogPostLink heading="最新記事" posts={recentPosts} />
          <BlogTagLink heading="カテゴリー" tags={tags} />
        </div>
      </div>
    </>
  )
}

export default BlogSlugPage
