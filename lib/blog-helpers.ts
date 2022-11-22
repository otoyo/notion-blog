export const getBlogLink = (slug: string) => {
  return `/blog/${slug}`
}

export const getTagLink = (tag: string) => {
  return `/blog/tag/${encodeURIComponent(tag)}`
}

export const getBeforeLink = (date: string) => {
  return `/blog/before/${date}`
}

export const getTagBeforeLink = (tag: string, date: string) => {
  return `/blog/tag/${encodeURIComponent(tag)}/before/${date}`
}

export const getDateStr = (date: string) => {
  const dt = new Date(date)
  const y = dt.getFullYear()
  const m = ('00' + (dt.getMonth() + 1)).slice(-2)
  const d = ('00' + dt.getDate()).slice(-2)
  return y + '-' + m + '-' + d
}

export const normalizeSlug = (slug: string) => {
  const startingSlash = slug.startsWith('/')
  const endingSlash = slug.endsWith('/')

  if (startingSlash) {
    slug = slug.substring(1)
  }
  if (endingSlash) {
    slug = slug.substring(0, slug.length - 1)
  }
  return startingSlash || endingSlash ? normalizeSlug(slug) : slug
}