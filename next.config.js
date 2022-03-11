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
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/subscribe',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=86400',
          },
        ],
      },
    ]
  },

  async rewrites() {
    return [
      { source: '/atom', destination: '/api/atom' },
      { source: '/sitemap', destination: '/api/sitemap' },
    ]
  },
}
