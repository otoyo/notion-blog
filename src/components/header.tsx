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

const labels = navItems.map(navItem => navItem.label)
const defaultTitle = 'アルパカログ'
const defaultOgImageUrl = 'https://alpacat.com/og-image.png'
const defaultDescription =
  'プログラミングやマネジメント、読んだ本のまとめを中心に書いているエンジニアブログ'

export default ({ titlePre = '' }) => {
  const { pathname } = useRouter()

  return (
    <header className={styles.header}>
      <Head>
        <title>
          {labels.includes(titlePre)
            ? defaultTitle
            : `${titlePre} - ${defaultTitle}`}
        </title>
        <meta name="description" content={defaultDescription} />
        <meta
          property="og:title"
          content={labels.includes(titlePre) ? defaultTitle : titlePre}
        />
        <meta property="og:image" content={defaultOgImageUrl} />
        <meta name="twitter:site" content="@otoyo0122" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={defaultOgImageUrl} />
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
