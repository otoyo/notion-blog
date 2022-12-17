import Link from 'next/link'
import { useRouter } from 'next/router'

import { NEXT_PUBLIC_URL } from '../app/server-constants'

import { NEXT_PUBLIC_SITE_TITLE } from '../app/server-constants'
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
          <img
            src="/images/site-logo@128x128.jpeg"
            alt="logo"
            width="64"
            height="64"
            className={styles.logo}
          />
          <h1>{NEXT_PUBLIC_SITE_TITLE}</h1>
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
