import dynamic from 'next/dynamic'
import ExtLink from './ext-link'

const Dynamic = {
  // default tags
  ol: 'ol',
  ul: 'ul',
  li: 'li',
  p: 'p',
  blockquote: 'blockquote',
  a: ExtLink,

  Code: dynamic(() => import('./code')),
  Callout: dynamic(() => import('./callout')),
  Equation: dynamic(() => import('./equation')),
}

export default Dynamic
