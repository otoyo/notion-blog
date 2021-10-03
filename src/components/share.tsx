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
import sharedStyles from '../styles/shared.module.css'

const Share = ({ title = '', url, id = null }) => {
  return (
    <>
      <ul className={sharedStyles.shareButtons}>
        <li className={sharedStyles.shareButton}>
          <TwitterShareButton
            url={url}
            title={title}
            beforeOnClick={() =>
              gtag.share({
                method: 'twitter',
                contentType: 'article',
                itemId: id,
              })
            }
          >
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
        </li>
        <li className={sharedStyles.shareButton}>
          <FacebookShareButton
            url={url}
            beforeOnClick={() =>
              gtag.share({
                method: 'facebook',
                contentType: 'article',
                itemId: id,
              })
            }
          >
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
        </li>
        <li className={sharedStyles.shareButton}>
          <PocketShareButton
            url={url}
            title={title}
            beforeOnClick={() =>
              gtag.share({
                method: 'pocket',
                contentType: 'article',
                itemId: id,
              })
            }
          >
            <PocketIcon size={32} round={true} />
          </PocketShareButton>
        </li>
        <li className={sharedStyles.shareButton}>
          <HatenaShareButton
            url={url}
            title={title}
            beforeOnClick={() =>
              gtag.share({
                method: 'hatena',
                contentType: 'article',
                itemId: id,
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
