import ExtLink from './ext-link'

import styles from '../styles/footer.module.css'

const Footer = () => (
  <footer className={styles.footer}>
    <div>
      <span>Powered by </span>
      <ExtLink href="https://github.com/otoyo/easy-notion-blog">
        easy-notion-blog
      </ExtLink>
    </div>
    <div>
      <span>Copyright © 2015-2022 otoyo. All Rights Reserved.</span>
    </div>
  </footer>
)

export default Footer
