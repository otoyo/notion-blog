import ExtLink from './ext-link'

export default () => (
  <>
    <footer>
      <div>
        <ExtLink href="/atom">
          <img src="/rss-feed-symbol.svg" width="12" height="12" /> Atom feed
        </ExtLink>
      </div>
      <div>
        <span>Powered by </span>
        <ExtLink href="https://github.com/ijjk/notion-blog">
          Notion Blog
        </ExtLink>
      </div>
      <div>
        <span>Copyright © 2015-2021 </span>
        <ExtLink href="https://twitter.com/otoyo0122">@otoyo0122</ExtLink>
        <span>. All Rights Reserved.</span>
      </div>
    </footer>
  </>
)
