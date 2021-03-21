import Link from 'next/link'
import Header from '../components/header'
import ExtLink from '../components/ext-link'
import sharedStyles from '../styles/shared.module.css'
import { getBlogLink } from '../lib/blog-helpers'

export default () => (
  <>
    <Header titlePre="" />
    <div className={sharedStyles.layout}>
      <img src="/young_alpaca.png" height="473" width="200" alt="Alpacat" />

      <div className="explanation">
        <p>
          プログラミングやマネジメント、読んだ本のまとめを中心に書いているエンジニアブログ
        </p>
      </div>

      <h2>書いている人</h2>

      <div className="explanation">
        <ExtLink href="https://twitter.com/otoyo0122">@otoyo0122</ExtLink>
        <p>
          CREというWebエンジニアでマネージャーな人です。エディタはNeoVimがお気に入り。記事内容に誤りがある際はお知らせください。CREでは一緒に働く仲間を募集しています。
          <Link
            href="/blog/[slug]"
            as={getBlogLink('recruitment-cre')}
            passHref
          >
            <a>→詳しく</a>
          </Link>
        </p>
      </div>
    </div>
  </>
)
