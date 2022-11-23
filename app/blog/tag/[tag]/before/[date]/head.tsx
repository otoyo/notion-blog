import DocumentHead from '../../../../../../components/document-head'

const BlogTagBeforeDateHead = async ({ params: { tag: encodedTag, date: encodedDate } }) => {
  const tag = decodeURIComponent(encodedTag)
  const date = decodeURIComponent(encodedDate)

  return (
    <DocumentHead description={`${tag}を含む ${date.split('T')[0]}より前の記事`} />
  )
}

export default BlogTagBeforeDateHead
