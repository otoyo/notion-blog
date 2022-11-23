import DocumentHead from '../../../../components/document-head'

const BlogBeforeDateHead = async ({ params: { date: encodedDate } }) => {
  const date = decodeURIComponent(encodedDate)

  return (
    <DocumentHead description={`${date.split('T')[0]}より前の記事`} />
  )
}

export default BlogBeforeDateHead
