// constants
const NOW = new Date()
const TIME_PUBLISHING = 9 * 60 * 60 // 09:00:00

export const getBlogLink = (slug: string) => {
  return `/blog/${slug}`
}

export const getTagLink = (tag: string) => {
  return `/blog/tag/${encodeURIComponent(tag)}`
}

export const getDateStr = date => {
  return new Date(date).toLocaleString('ja-JP', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}

export const postIsPublished = (post: any) => {
  return post.Published === 'Yes' && new Date(post.Date + TIME_PUBLISHING) < NOW
}

export const normalizeSlug = slug => {
  if (typeof slug !== 'string') return slug

  let startingSlash = slug.startsWith('/')
  let endingSlash = slug.endsWith('/')

  if (startingSlash) {
    slug = slug.substr(1)
  }
  if (endingSlash) {
    slug = slug.substr(0, slug.length - 1)
  }
  return startingSlash || endingSlash ? normalizeSlug(slug) : slug
}
