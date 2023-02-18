export const NOTION_API_SECRET = process.env.NOTION_API_SECRET || ''
export const DATABASE_ID = process.env.DATABASE_ID || ''
export const INDEX_PAGE_ID = process.env.INDEX_PAGE_ID || ''
export const SUBSCRIPTION_PAGE_ID = process.env.SUBSCRIPTION_PAGE_ID || ''

export const BASE_PATH = process.env.BASE_PATH || '' // <- Set sub directory path if you want. e.g. /docs/

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ''
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || ''
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || ''

export const PUBLIC_GA_TRACKING_ID = import.meta.env.PUBLIC_GA_TRACKING_ID
export const NUMBER_OF_POSTS_PER_PAGE = 10
export const REQUEST_TIMEOUT_MS = parseInt(
  import.meta.env.REQUEST_TIMEOUT_MS || '10000',
  10
)

export const PUBLIC_SITE_TITLE = 'アルパカログ'
export const PUBLIC_SITE_DESCRIPTION =
  'Notion Blogのカスタマイズ、マネジメント、プログラミングや読んだ本のまとめなどが中心のブログ'
