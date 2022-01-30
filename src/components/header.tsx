import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'

import ExtLink from './ext-link'
import styles from '../styles/header.module.css'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'ホーム', page: '/' },
  { label: 'ブログ', page: '/blog' },
  { label: '読者になる', page: '/subscribe' },
]

const defaultUrl = 'https://alpacat.com'
const defaultTitle = 'アルパカログ'
const defaultOgImageUrl = 'https://alpacat.com/og-image.jpeg'
const defaultDescription =
  'Notion Blogのカスタマイズ、マネジメント、プログラミングや読んだ本のまとめなどが中心のブログ'

const Header = ({
  path = '',
  titlePre = '',
  description = '',
  ogImageUrl = '',
}) => {
  const { pathname } = useRouter()

  return (
    <header className={styles.header}>
      <Head>
        <title>
          {!titlePre ? defaultTitle : `${titlePre} - ${defaultTitle}`}
        </title>
        <meta
          name="description"
          content={!description ? defaultDescription : description}
        />
        <meta property="og:url" content={`${defaultUrl}${path}`} />
        <meta
          property="og:title"
          content={!titlePre ? defaultTitle : titlePre}
        />
        <meta
          property="og:description"
          content={!description ? defaultDescription : description}
        />
        <meta
          property="og:image"
          content={!ogImageUrl ? defaultOgImageUrl : ogImageUrl}
        />
        <meta name="twitter:site" content="@otoyo0122" />
        <meta
          name="twitter:card"
          content={!ogImageUrl ? 'summary' : 'summary_large_image'}
        />
        <meta
          name="twitter:image"
          content={!ogImageUrl ? defaultOgImageUrl : ogImageUrl}
        />
        <link rel="canonical" href={`${defaultUrl}${path}`} />
        <link
          rel="alternate"
          type="application/atom+xml"
          href="/atom"
          title="アルパカログのフィード"
        />
      </Head>
      <h1>
        <Link href="/" passHref>
          <a>アルパカログ</a>
        </Link>
      </h1>
      <ul>
        {navItems.map(({ label, page, link }) => (
          <li key={label}>
            {page ? (
              <Link href={page} passHref>
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

export default Header
