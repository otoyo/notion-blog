import Link from 'next/link'
import Image from 'next/image'

import DocumentHead from '../components/document-head'
import ExtLink from '../components/ext-link'
import styles from '../styles/page.module.css'
import { getBlogLink } from '../lib/blog-helpers'

const RenderPage = () => (
  <div className={styles.container}>
    <DocumentHead />

    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Image src="/young_alpaca.png" height="473" width="200" alt="Alpacat" />
    </div>

    <div className="explanation">
      <p>
        Notion
        Blogのカスタマイズ、マネジメント、プログラミングや読んだ本のまとめなどが中心のブログ。このブログは
        <ExtLink href="https://github.com/otoyo/easy-notion-blog">
          easy-notion-blog
        </ExtLink>
        を使ってNotionで書かれています。
      </p>
    </div>

    <h2>書いている人</h2>

    <div className="explanation">
      <ExtLink href="https://twitter.com/otoyo0122">@otoyo0122</ExtLink>
      <p>
        CREというカスタマーサポートのために働くWebエンジニアでマネジメントも少し。記事内容に誤りがある際はお知らせください。CREでは一緒に働く仲間を募集しています。
        <Link href="/blog/[slug]" as={getBlogLink('recruitment-cre')} passHref>
          <a>→詳しく</a>
        </Link>
      </p>
    </div>
  </div>
)

export default RenderPage
