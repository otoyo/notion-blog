import DocumentHead from '../../components/document-head'
import { SUBSCRIPTION_PAGE_ID } from '../../app/server-constants'
import { getAllBlocksByBlockId } from '../../lib/notion/client'
import NotionBlocks from '../../components/notion-block'

import styles from '../../styles/page.module.css'

export async function getServerSideProps() {
  const blocks = await getAllBlocksByBlockId(SUBSCRIPTION_PAGE_ID)

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