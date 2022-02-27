module.exports = {
  images: {
    domains: ['s3.us-west-2.amazonaws.com', 'images.unsplash.com'],
  },

  outputFileTracing: false,

  async rewrites() {
    return [
      { source: '/atom', destination: '/api/atom' },
      { source: '/sitemap', destination: '/api/sitemap' },
    ]
  },
}
