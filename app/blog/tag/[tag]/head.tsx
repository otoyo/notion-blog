import DocumentHead from '../../../../components/document-head'

const BlogTagHead = async ({ params: { tag: encodedTag } }) => {
  const tag = decodeURIComponent(encodedTag)

  return (
    <DocumentHead description={`${tag}を含む記事`} />
  )
}

export default BlogTagHead
