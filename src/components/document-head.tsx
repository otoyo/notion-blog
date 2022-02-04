import Head from 'next/head'
import { useRouter } from 'next/router'

import { NEXT_PUBLIC_URL } from '../lib/notion/server-constants'

export const SITE_TITLE = 'アルパカログ'
export const SITE_DESCRIPTION =
  'Notion Blogのカスタマイズ、マネジメント、プログラミングや読んだ本のまとめなどが中心のブログ'

const DocumentHead = ({ title = '', description = '', urlOgImage = '' }) => {
  const { asPath, pathname } = useRouter()

  const currentURL = new URL(asPath, NEXT_PUBLIC_URL)
  const defaultImageURL = new URL('/og-image.jpeg', NEXT_PUBLIC_URL)

  return (
    <Head>
      <title>{title ? `${title} - ${SITE_TITLE}` : SITE_TITLE}</title>
      <meta
        name="description"
        content={description ? description : SITE_DESCRIPTION}
      />
      <meta property="og:url" content={currentURL.toString()} />
      <meta property="og:title" content={title ? title : SITE_TITLE} />
      <meta
        property="og:description"
        content={description ? description : SITE_DESCRIPTION}
      />
      <meta
        property="og:image"
        content={urlOgImage ? urlOgImage : defaultImageURL.toString()}
      />
      <meta name="twitter:site" content="@otoyo0122" />
      <meta
        name="twitter:card"
        content={
          pathname === '/blog/[slug]' && urlOgImage
            ? 'summary_large_image'
            : 'summary'
        }
      />
      <meta
        name="twitter:image"
        content={urlOgImage ? urlOgImage : defaultImageURL.toString()}
      />
      <link rel="canonical" href={currentURL.toString()} />
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
