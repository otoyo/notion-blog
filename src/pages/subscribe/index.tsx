import DocumentHead from '../../components/document-head'
import ExtLink from '../../components/ext-link'
import styles from '../../styles/page.module.css'

const RenderSubscribePage = () => (
  <div className={styles.container}>
    <DocumentHead title="購読する" description="アルパカログを購読する" />

    <div>
      <h2>RSSフィードを購読する</h2>
      <p>
        <code>https://alpacat.com/atom</code>
      </p>
      <p>お使いのRSSリーダーに上記のフィードURLをご登録ください。</p>
    </div>

    <div>
      <h2>Twitterでフォローする</h2>
      <p>
        <ExtLink href="https://twitter.com/otoyo0122">@otoyo0122</ExtLink>
      </p>
      <p>Twitterでフォローして更新情報を受け取ることもできます。</p>
    </div>
  </div>
)

export default RenderSubscribePage
