/* eslint @typescript-eslint/no-var-requires: 0 */
// use commonjs so it can be required without transpiling

const NOTION_API_SECRET = process.env.NOTION_API_SECRET
const DATABASE_ID = process.env.DATABASE_ID
const INDEX_PAGE_ID = process.env.INDEX_PAGE_ID
const SUBSCRIPTION_PAGE_ID = process.env.SUBSCRIPTION_PAGE_ID
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL
const NEXT_PUBLIC_GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID
const NEXT_PUBLIC_SITE_TITLE = 'アルパカログ'
const NEXT_PUBLIC_SITE_DESCRIPTION = 'Notion Blogのカスタマイズ、マネジメント、プログラミングや読んだ本のまとめなどが中心のブログ'
const NUMBER_OF_POSTS_PER_PAGE = 10

module.exports = {
  NOTION_API_SECRET,
  DATABASE_ID,
  INDEX_PAGE_ID,
  SUBSCRIPTION_PAGE_ID,
  NEXT_PUBLIC_URL,
  NEXT_PUBLIC_GA_TRACKING_ID,
  NEXT_PUBLIC_SITE_TITLE,
  NEXT_PUBLIC_SITE_DESCRIPTION,
  NUMBER_OF_POSTS_PER_PAGE,
}
