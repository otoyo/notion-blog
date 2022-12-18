'use client'

import { usePathname } from "next/navigation"
import Link from 'next/link'
import { NEXT_PUBLIC_SITE_TITLE } from '../app/server-constants'
import styles from '../styles/header.module.css'

interface NavItem {
  label: string
  path: string
}

const Header = () => {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { label: 'ホーム', path: '/' },
    { label: 'ブログ', path: '/blog' },
    { label: '読者になる', path: '/subscribe' },
  ]

  return (
    <header className={styles.header}>
      <Link href="/">
        <img
          src="/images/site-logo@128x128.jpeg"
          alt="logo"
          width="64"
          height="64"
          className={styles.logo}
        />
        <h1>{NEXT_PUBLIC_SITE_TITLE}</h1>
      </Link>

      <ul>
        {navItems.map(({ label, path }) => (
          <li key={label}>
            <Link href={path} className={pathname === path ? 'active' : null}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  )
}

export default Header
