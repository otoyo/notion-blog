import { notFound } from 'next/navigation'
import { NUMBER_OF_POSTS_PER_PAGE } from '../../../../../../app/server-constants'
import GoogleAnalytics from '../../../../../../components/google-analytics'
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
  ReadMoreLink,
} from '../../../../../../components/blog-parts'
import {
  getPosts,
  getRankedPosts,
  getPopularPosts,
  getPostsByTagBefore,
  getFirstPostByTag,
  getAllTags,
} from '../../../../../../lib/notion/client'
import styles from '../../../../../../styles/blog.module.css'

export const revalidate = 900

const BlogTagBeforeDatePage = async ({ params: { tag: encodedTag, date: encodedDate } }) => {
  const tag = decodeURIComponent(encodedTag)
  const date = decodeURIComponent(encodedDate)

  if (!Date.parse(date) || !/^\d{4}-\d{2}-\d{2}/.test(date)) {
    notFound()
  }

  const [posts, firstPost, rankedPosts, popularPosts, recentPosts, tags] = await Promise.all([
    getPostsByTagBefore(tag, date, NUMBER_OF_POSTS_PER_PAGE),
    getFirstPostByTag(tag),
    getRankedPosts(),
    getPopularPosts(5),
    getPosts(5),
    getAllTags(),
  ])

  return (
    <>
      <GoogleAnalytics pageTitle={`${tag}を含む ${date.split('T')[0]}より前の記事`} />
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <header>
            <h2>{tag}を含む {date.split('T')[0]}より前の記事</h2>
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
            <NextPageLink firstPost={firstPost} posts={posts} tag={tag} />
          </footer>
        </div>

        <div className={styles.subContent}>
          <BlogPostLink heading="おすすめ記事" posts={rankedPosts} />
          <BlogPostLink heading="人気の記事" posts={popularPosts} />
          <BlogPostLink heading="最新記事" posts={recentPosts} />
          <BlogTagLink heading="カテゴリー" tags={tags} />
        </div>
      </div>
    </>
  )
}

export default BlogTagBeforeDatePage
