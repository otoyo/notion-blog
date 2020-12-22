import Link from 'next/link'
import Head from 'next/head'
import ExtLink from './ext-link'
import { useRouter } from 'next/router'
import styles from '../styles/header.module.css'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
  { label: 'Blog', page: '/blog' },
  { label: 'Source Code', link: 'https://github.com/otoyo/notion-blog' },
]

const ogImageUrl = 'https://alpacat.com/og-image.png'

export default ({ titlePre = '' }) => {
  const { pathname } = useRouter()

  return (
    <header className={styles.header}>
      <Head>
        <title>
          {titlePre && titlePre != 'Home' ? `${titlePre} |` : ''} アルパカログ
        </title>
        <meta
          name="description"
          content="プログラミングやマネジメント、読んだ本のまとめを中心に書いているエンジニアブログ"
        />
        <meta property="og:title" content="アルパカログ" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@otoyo0122" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <h1>アルパカログ</h1>
      <ul>
        {navItems.map(({ label, page, link }) => (
          <li key={label}>
            {page ? (
              <Link href={page}>
                <a className={pathname === page ? 'active' : undefined}>
                  {label}
                </a>
              </Link>
            ) : (
              <ExtLink href={link}>{label}</ExtLink>
            )}
          </li>
        ))}
      </ul>
    </header>
  )
}
