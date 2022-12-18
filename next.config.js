module.exports = {
  images: {
    domains: ['s3.us-west-2.amazonaws.com', 'images.unsplash.com'],
  },

  outputFileTracing: false,

  headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=2592000, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=2592000, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, max-age=86400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/subscribe',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, max-age=86400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/blog',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=900, max-age=900',
          },
        ],
      },
      {
        source: '/blog/:slug',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=900, max-age=900',
          },
        ],
      },
      {
        source: '/blog/before/:date',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=900, max-age=900',
          },
        ],
      },
      {
        source: '/blog/tag/:tag*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=900, max-age=900',
          },
        ],
      },
      {
        source: '/feed',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=1800, max-age=1800',
          },
        ],
      },
      {
        source: '/sitemap',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, max-age=3600',
          },
        ],
      },
      {
        source: '/api/like',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
      {
        source: '/api/url-metadata',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
    ]
  },

  async rewrites() {
    return [
      { source: '/feed', destination: '/api/feed' },
      { source: '/atom', destination: '/api/feed' },
      { source: '/sitemap', destination: '/api/sitemap' },
    ]
  },
}
