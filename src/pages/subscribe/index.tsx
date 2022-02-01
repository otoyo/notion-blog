import DocumentHead from '../../components/document-head'
import ExtLink from '../../components/ext-link'
import styles from '../../styles/page.module.css'

const RenderSubscribePage = () => (
  <div className={styles.container}>
    <DocumentHead title="購読する" description="アルパカログを購読する" />

    <h2>Twitterで更新情報を受け取る</h2>
    <div className="explanation">
      <ExtLink href="https://twitter.com/otoyo0122">@otoyo0122</ExtLink>
      <p>
        こちらのアカウントをフォローするとTwitterでアルパカログの更新情報を受け取ることができます。
      </p>
    </div>

    <h2>Slackで更新情報を受け取る</h2>
    <div className="explanation">
      <p>Slackで更新情報を受け取ることもできます。</p>
      <p>
        SlackでRSSアプリをインストール後、更新を通知したいチャンネルで次のコマンドを入力します。
      </p>
      <p>
        <code>/feed subscribe https://alpacat.com/atom</code>
      </p>
      <p>詳しくは下記のヘルプをご覧ください。</p>
      <ul>
        <li>
          <ExtLink href="https://slack.com/intl/ja-jp/help/articles/218688467-Slack-%E3%81%AB-RSS-%E3%83%95%E3%82%A3%E3%83%BC%E3%83%89%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B">
            Slack に RSS フィードを追加する
          </ExtLink>
        </li>
      </ul>
    </div>

    <h2>お使いのRSSリーダーで更新情報を受け取る</h2>
    <div className="explanation">
      <p>
        お使いのRSSリーダーで更新情報を受け取るには下記のURLを登録してください。
      </p>
      <p>
        <code>https://alpacat.com/atom</code>
      </p>
    </div>
  </div>
)

export default RenderSubscribePage
