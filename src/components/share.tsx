// components/Share.tsx
import React from 'react'
import { TwitterIcon, TwitterShareButton } from 'react-share'

export default ({ text = '', url = '' }) => {
  return (
    <TwitterShareButton url={url} title={text}>
      <TwitterIcon size={32} round={true} />
    </TwitterShareButton>
  )
}
