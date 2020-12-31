import Link from 'next/link'
import ExtLink from './ext-link'

export default () => (
  <>
    <footer>
      <div>
        <Link href="/atom" passHref>
          <a>
            <img src="/rss-feed-symbol.svg" width="12" height="12" /> Atom feed
          </a>
        </Link>
      </div>
      <div>
        <span>Powered by </span>
        <ExtLink href="https://github.com/ijjk/notion-blog">
          Notion Blog
        </ExtLink>
      </div>
      <div>
        <span>Copyright © 2015-2020 </span>
        <ExtLink href="https://twitter.com/otoyo0122">@otoyo0122</ExtLink>
        <span>. All Rights Reserved.</span>
      </div>
    </footer>
  </>
)
