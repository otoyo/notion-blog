import DocumentHead from '../../components/document-head'
import { SUBSCRIPTION_PAGE_ID } from '../../lib/notion/server-constants'
import { getAllBlocksByBlockId } from '../../lib/notion/client'
import NotionBlocks from '../../components/notion-block'

import styles from '../../styles/page.module.css'

export async function getServerSideProps({ res }) {
  const blocks = await getAllBlocksByBlockId(SUBSCRIPTION_PAGE_ID)

  res.setHeader(
    'Cache-Control',
    'public, max-age=900'
  )

  return {
    props: {
      blocks,
    },
  }
}

const RenderSubscribePage = ({ blocks }) => (
  <div className={styles.container}>
    <DocumentHead title="購読する" description="アルパカログを購読する" />
    <NotionBlocks blocks={blocks} />
  </div>
)

export default RenderSubscribePage
