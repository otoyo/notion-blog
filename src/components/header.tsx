import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { NEXT_PUBLIC_URL } from '../lib/notion/server-constants'

import { SITE_TITLE } from '../components/document-head'
import styles from '../styles/header.module.css'

interface NavItem {
  label: string
  path: string
}

const Header = () => {
  const { asPath } = useRouter()
  const url = new URL(asPath, NEXT_PUBLIC_URL)

  const navItems: NavItem[] = [
    { label: 'ホーム', path: '/' },
    { label: 'ブログ', path: '/blog' },
    { label: '読者になる', path: '/subscribe' },
  ]

  return (
    <header className={styles.header}>
      <Link href="/" passHref>
        <a>
          <Image
            src="/site-logo.jpeg"
            alt="logo"
            width={64}
            height={64}
            layout="fixed"
            quality={100}
            className={styles.logo}
          />
          <h1>{SITE_TITLE}</h1>
        </a>
      </Link>

      <ul>
        {navItems.map(({ label, path }) => (
          <li key={label}>
            <Link href={path} passHref>
              <a className={url.pathname === path ? 'active' : null}>{label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </header>
  )
}

export default Header
