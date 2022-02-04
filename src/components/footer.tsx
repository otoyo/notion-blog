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
      <span>Copyright © 2015-2021 </span>
      <ExtLink href="https://twitter.com/otoyo0122">@otoyo0122</ExtLink>
      <span>. All Rights Reserved.</span>
    </div>
  </footer>
)

export default Footer
