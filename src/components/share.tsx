// components/Share.tsx
import React from 'react'
import {
  FacebookIcon,
  FacebookShareButton,
  HatenaIcon,
  HatenaShareButton,
  PocketIcon,
  PocketShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'

import * as gtag from '../lib/gtag'

const Share = ({ text = '', url = '' }) => {
  return (
    <>
      <ul className="shareButtons">
        <li>
          <TwitterShareButton
            url={url}
            title={text}
            beforeOnClick={() =>
              gtag.event({
                action: 'share',
                category: 'engagement',
                label: 'twitter',
              })
            }
          >
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
        </li>
        <li>
          <FacebookShareButton
            url={url}
            beforeOnClick={() =>
              gtag.event({
                action: 'share',
                category: 'engagement',
                label: 'facebook',
              })
            }
          >
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
        </li>
        <li>
          <PocketShareButton
            url={url}
            title={text}
            beforeOnClick={() =>
              gtag.event({
                action: 'share',
                category: 'engagement',
                label: 'pocket',
              })
            }
          >
            <PocketIcon size={32} round={true} />
          </PocketShareButton>
        </li>
        <li>
          <HatenaShareButton
            url={url}
            title={text}
            beforeOnClick={() =>
              gtag.event({
                action: 'share',
                category: 'engagement',
                label: 'hatena',
              })
            }
          >
            <HatenaIcon size={32} round={true} />
          </HatenaShareButton>
        </li>
      </ul>
    </>
  )
}

export default Share
