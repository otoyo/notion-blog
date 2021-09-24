import Script from 'next/script'
import { GA_TRACKING_ID } from '../lib/notion/server-constants'

const GoogleAnalytics = () => {
  return (
    <>
      {GA_TRACKING_ID && (
        <>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <Script
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga" defer strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag() { dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
              `}
          </Script>
        </>
      )}
    </>
  )
}

export default GoogleAnalytics
