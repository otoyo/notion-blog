import Link from 'next/link'
import Image from 'next/image'

import DocumentHead from '../components/document-head'
import ExtLink from '../components/ext-link'
import styles from '../styles/page.module.css'
import { getBlogLink } from '../lib/blog-helpers'

const RenderPage = () => (
  <div className={styles.container}>
    <DocumentHead />

    <div>
      <h2>About</h2>
      <p>
        アルパカログは Notion Blog が好きな Web エンジニアの個人ブログです。
      </p>
      <p>下記のような話題がよく登場します。</p>
      <ul>
        <li>Notion Blog のカスタマイズ</li>
        <li>Web アプリケーション開発</li>
        <li>ピープルマネジメント</li>
        <li>プログラミング (Ruby, Python, Go, TypeScript etc.)</li>
      </ul>
      <p>更新は毎週月曜です。</p>
      <p>
        このブログも Notion で書かれています。興味がある方は下記をご覧ください。
      </p>
      <ul>
        <li>
          <Link
            href="/blog/[slug]"
            as={getBlogLink('easy-notion-blog')}
            passHref
          >
            <a>
              Notion Blog 始めたい人に向けてスタートキットを作ったので紹介する
            </a>
          </Link>
        </li>
      </ul>
    </div>

    <div>
      <h2>Profile</h2>
      <Image
        src="/profile.png"
        alt="profile"
        width={64}
        height={64}
        layout="fixed"
        quality={100}
        className={styles.profile}
      />
      <p>
        渋谷の Web
        系企業で働くソフトウェアエンジニア兼エンジニアリング・マネージャー兼
        Customer Reliability Engineer(CRE)。
      </p>
      <p>ブログが好きすぎて気がつけば自分で作っていた。</p>
      <p>アルパカがトレードマーク。</p>
    </div>

    <div>
      <h2>Social accounts</h2>
      <ul>
        <li>
          <ExtLink href="https://github.com/otoyo">GitHub</ExtLink>
        </li>
        <li>
          <ExtLink href="https://twitter.com/otoyo0122">Twitter</ExtLink>
        </li>
        <li>
          <ExtLink href="https://www.wantedly.com/id/otoyo">Wantedly</ExtLink>
        </li>
      </ul>
    </div>

    <div>
      <h2>Contact</h2>
      <p>
        GitHub で公開しているソフトウェアに関しては GitHub Issues
        でお願いします。
      </p>
      <p>
        リクルーティングに関しては Wantedly
        からお願いします(現在求職中ではありません)。
      </p>
      <p>その他は Twitter でご連絡ください。</p>
      <p>メールはご遠慮ください。</p>
    </div>
  </div>
)

export default RenderPage
