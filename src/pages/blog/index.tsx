import DocumentHead from '../../components/document-head'
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
} from '../../components/blog-parts'
import styles from '../../styles/blog.module.css'
import {
  getPosts,
  getFirstPost,
  getRankedPosts,
  getPopularPosts,
  getAllTags,
} from '../../lib/notion/client'

export async function getServerSideProps() {
  const [posts, firstPost, rankedPosts, popularPosts, tags] = await Promise.all([
    getPosts(),
    getFirstPost(),
    getRankedPosts(),
    getPopularPosts(5),
    getAllTags(),
  ])

  return {
    props: {
      posts,
      firstPost,
      rankedPosts,
      popularPosts,
      tags,
    },
  }
}

const RenderPosts = ({
  posts = [],
  firstPost,
  rankedPosts = [],
  popularPosts = [],
  tags = [],
}) => {
  return (
    <div className={styles.container}>
      <DocumentHead title="ブログ" />

      <div className={styles.mainContent}>
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

export default RenderPosts
