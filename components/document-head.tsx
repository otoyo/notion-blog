import {
  NEXT_PUBLIC_URL,
  NEXT_PUBLIC_SITE_TITLE,
  NEXT_PUBLIC_SITE_DESCRIPTION,
} from '../app/server-constants'

const DocumentHead = ({ title = '', description = '', path = '', urlOgImage = '' }) => {
  const elements = path.split('/')
  const isSlugPath = elements[0] === '' && elements[1] === 'blog' && elements.length === 3

  return (
    <>
      <title>{title ? `${title} - ${NEXT_PUBLIC_SITE_TITLE}` : NEXT_PUBLIC_SITE_TITLE}</title>
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <meta
        name="description"
        content={description ? description : NEXT_PUBLIC_SITE_DESCRIPTION}
      />
      {NEXT_PUBLIC_URL ? (
        <meta
          property="og:url"
          content={new URL(path, NEXT_PUBLIC_URL).toString()}
        />
      ) : null}
      <meta property="og:title" content={title ? title : NEXT_PUBLIC_SITE_TITLE} />
      <meta
        property="og:description"
        content={description ? description : NEXT_PUBLIC_SITE_DESCRIPTION}
      />
      {urlOgImage ? (
        <meta property="og:image" content={urlOgImage} />
      ) : NEXT_PUBLIC_URL ? (
        <meta
          property="og:image"
          content={new URL(
            '/images/site-logo.jpeg',
            NEXT_PUBLIC_URL
          ).toString()}
        />
      ) : null}
      <meta name="twitter:site" content="@otoyo0122" />
      <meta
        name="twitter:card"
        content={
          isSlugPath && urlOgImage
            ? 'summary_large_image'
            : 'summary'
        }
      />
      {urlOgImage ? (
        <meta name="twitter:image" content={urlOgImage} />
      ) : NEXT_PUBLIC_URL ? (
        <meta
          name="twitter:image"
          content={new URL(
            '/images/site-logo.jpeg',
            NEXT_PUBLIC_URL
          ).toString()}
        />
      ) : null}
      {NEXT_PUBLIC_URL ? (
        <link
          rel="canonical"
          href={new URL(path, NEXT_PUBLIC_URL).toString()}
        />
      ) : null}
      <link
        rel="alternate"
        type="application/atom+xml"
        href="/feed"
        title="アルパカログのフィード"
      />
    </>
  )
}

export default DocumentHead
