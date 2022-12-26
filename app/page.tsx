import GoogleAnalytics from '../components/google-analytics'
import { INDEX_PAGE_ID } from './server-constants'
import { getAllBlocksByBlockId } from '../lib/notion/client'
import NotionBlocks from '../components/notion-block'
import styles from '../styles/page.module.css'

export const revalidate = 86400

const RootPage = async () => {
  const blocks = await getAllBlocksByBlockId(INDEX_PAGE_ID)
  return (
    <>
      <GoogleAnalytics />
      <div className={styles.container}>
        <NotionBlocks blocks={blocks} />
      </div>
    </>
  )
}

export default RootPage
