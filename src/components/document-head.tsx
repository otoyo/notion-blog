import Head from 'next/head'
import { useRouter } from 'next/router'

import { NEXT_PUBLIC_URL } from '../lib/notion/server-constants'

export const SITE_TITLE = 'アルパカログ'
export const SITE_DESCRIPTION =
  'Notion Blogのカスタマイズ、マネジメント、プログラミングや読んだ本のまとめなどが中心のブログ'

const DocumentHead = ({ title = '', description = '', urlOgImage = '' }) => {
  const { pathname } = useRouter()

  return (
    <Head>
      <title>{title ? `${title} - ${SITE_TITLE}` : SITE_TITLE}</title>
      <meta
        name="description"
        content={description ? description : SITE_DESCRIPTION}
      />
      <meta
        property="og:url"
        content={
          urlOgImage
            ? urlOgImage
            : new URL('/og-image.jpeg', NEXT_PUBLIC_URL).toString()
        }
      />
      <meta property="og:title" content={title ? title : SITE_TITLE} />
      <meta
        property="og:description"
        content={description ? description : SITE_DESCRIPTION}
      />
      <meta
        property="og:image"
        content={
          urlOgImage
            ? urlOgImage
            : new URL('/og-image.jpeg', NEXT_PUBLIC_URL).toString()
        }
      />
      <meta name="twitter:site" content="@otoyo0122" />
      <meta
        name="twitter:card"
        content={urlOgImage ? 'summary' : 'summary_large_image'}
      />
      <meta
        name="twitter:image"
        content={
          urlOgImage
            ? urlOgImage
            : new URL('/og-image.jpeg', NEXT_PUBLIC_URL).toString()
        }
      />
      <link
        rel="canonical"
        href={new URL(pathname, NEXT_PUBLIC_URL).toString()}
      />
      <link
        rel="alternate"
        type="application/atom+xml"
        href="/atom"
        title="アルパカログのフィード"
      />
    </Head>
  )
}

export default DocumentHead
