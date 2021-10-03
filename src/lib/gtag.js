export const GA_TRACKING_ID = 'G-M08P8YF8KX'

// https://developers.google.com/analytics/devguides/migration/measurement/virtual-pageviews
export const pageview = (title, url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_title: title,
    page_location: url,
  })
}

// https://developers.google.com/gtagjs/reference/ga4-events
export const share = ({ method, contentType, itemId = null }) => {
  window.gtag('event', 'share', {
    method: method,
    content_type: contentType,
    item_id: itemId,
  })
}

export const like = ({ contentType, itemId }) => {
  window.gtag('event', 'like', {
    content_type: contentType,
    item_id: itemId,
  })
}
