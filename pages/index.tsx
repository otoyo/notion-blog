import DocumentHead from '../components/document-head'
import styles from '../styles/page.module.css'
import { INDEX_PAGE_ID } from '../app/server-constants'
import { getAllBlocksByBlockId } from '../lib/notion/client'
import NotionBlocks from '../components/notion-block'

export async function getServerSideProps() {
  const blocks = await getAllBlocksByBlockId(INDEX_PAGE_ID)

  return {
    props: {
      blocks,
    },
  }
}

const RenderPage = ({ blocks }) => (
  <div className={styles.container}>
    <DocumentHead />
    <NotionBlocks blocks={blocks} />
  </div>
)

export default RenderPage
