import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from '../styles/header.module.css'

interface NavItem {
  label: string
  path: string
}

const Header = () => {
  const { pathname } = useRouter()

  const navItems: NavItem[] = [
    { label: 'ホーム', path: '/' },
    { label: 'ブログ', path: '/blog' },
    { label: '読者になる', path: '/subscribe' },
  ]

  return (
    <header className={styles.header}>
      <h1>
        <Link href="/" passHref>
          <a>アルパカログ</a>
        </Link>
      </h1>

      <ul>
        {navItems.map(({ label, path }) => (
          <li key={label}>
            <Link href={path} passHref>
              <a className={pathname === path ? 'active' : null}>{label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </header>
  )
}

export default Header
