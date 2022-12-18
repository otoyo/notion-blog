import { notFound } from 'next/navigation'
import { NUMBER_OF_POSTS_PER_PAGE } from '../../../../app/server-constants'
import GoogleAnalytics from '../../../../components/google-analytics'
import {
  getRankedPosts,
  getPopularPosts,
  getPostsBefore,
  getFirstPost,
  getAllTags,
} from '../../../../lib/notion/client'
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
} from '../../../../components/blog-parts'
import styles from '../../../../styles/blog.module.css'

const BlogBeforeDatePage = async ({ params: { date: encodedDate } }) => {
  const date = decodeURIComponent(encodedDate)

  if (!Date.parse(date) || !/^\d{4}-\d{2}-\d{2}/.test(date)) {
    notFound()
  }

  const [posts, firstPost, rankedPosts, popularPosts, tags] = await Promise.all([
    getPostsBefore(date, NUMBER_OF_POSTS_PER_PAGE),
    getFirstPost(),
    getRankedPosts(),
    getPopularPosts(5),
    getAllTags(),
  ])

  return (
    <>
      <GoogleAnalytics pageTitle={`${date.split('T')[0]}より前の記事`} />
      <div className={styles.container}>
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
    </>
  )
}

export default BlogBeforeDatePage
