// components/Share.tsx
import React from 'react'
import {
  FacebookIcon,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'

export default ({ text = '', url = '' }) => {
  return (
    <>
      <ul className="shareButtons">
        <li>
          <TwitterShareButton url={url} title={text}>
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
        </li>
        <li>
          <FacebookShareButton url={url}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
        </li>
        <li>
          <HatenaShareButton url={url} title={text}>
            <HatenaIcon size={32} round={true} />
          </HatenaShareButton>
        </li>
      </ul>
    </>
  )
}
