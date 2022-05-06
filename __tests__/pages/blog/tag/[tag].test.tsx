import { render } from '@testing-library/react'
import RenderPostsByTags from '../../../../src/pages/blog/tag/[tag]'

import {
  getPosts,
  getPostsByTag,
  getFirstPostByTag,
  getRankedPosts,
  getAllTags,
} from '../../../../src/lib/notion/client'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      asPath: '/blog/tag/Diary',
      pathname: '/blog/tag/[tag]',
    }
  },
}))

describe('RenderPostsByTags', () => {
  it('renders the page unchanged', async () => {
    const tag = 'Diary'
    const posts = await getPostsByTag(tag)
    const firstPost = await getFirstPostByTag(tag)
    const rankedPosts = await getRankedPosts()
    const recentPosts = await getPosts(5)
    const tags = await getAllTags()

    const { container } = render(
      <RenderPostsByTags
        tag={tag}
        posts={posts}
        firstPost={firstPost}
        rankedPosts={rankedPosts}
        recentPosts={recentPosts}
        tags={tags}
        redirect={null}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
