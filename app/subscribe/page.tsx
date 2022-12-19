import {
  SUBSCRIPTION_PAGE_ID,
  NEXT_PUBLIC_SITE_TITLE,
} from '../../app/server-constants'
import { getAllBlocksByBlockId } from '../../lib/notion/client'
import NotionBlocks from '../../components/notion-block'
import GoogleAnalytics from '../../components/google-analytics'

import styles from '../../styles/page.module.css'

const SubscribePage = async () => {
  const blocks = await getAllBlocksByBlockId(SUBSCRIPTION_PAGE_ID)

  return (
    <>
      <GoogleAnalytics pageTitle={NEXT_PUBLIC_SITE_TITLE} />
      <div className={styles.container}>
        <NotionBlocks blocks={blocks} />
      </div>
    </>
  )
}

export default SubscribePage
