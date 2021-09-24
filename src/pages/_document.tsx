import Document, { Html, Head, Main, NextScript } from 'next/document'

import GoogleAnalytics from '../components/google-analytics'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <GoogleAnalytics />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
