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
import Like from './like'

const SocialButtons = ({ title = '', url, slug = null }) => {
  return (
    <>
      <ul className={sharedStyles.socialButtons}>
        <li className={sharedStyles.socialButtonsItem}>
          <TwitterShareButton
            url={url}
            title={title}
            beforeOnClick={() =>
              gtag.share({
                method: 'twitter',
                contentType: 'article',
                itemId: slug,
              })
            }
          >
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
        </li>
        <li className={sharedStyles.socialButtonsItem}>
          <FacebookShareButton
            url={url}
            beforeOnClick={() =>
              gtag.share({
                method: 'facebook',
                contentType: 'article',
                itemId: slug,
              })
            }
          >
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
        </li>
        <li className={sharedStyles.socialButtonsItem}>
          <PocketShareButton
            url={url}
            title={title}
            beforeOnClick={() =>
              gtag.share({
                method: 'pocket',
                contentType: 'article',
                itemId: slug,
              })
            }
          >
            <PocketIcon size={32} round={true} />
          </PocketShareButton>
        </li>
        <li className={sharedStyles.socialButtonsItem}>
          <HatenaShareButton
            url={url}
            title={title}
            beforeOnClick={() =>
              gtag.share({
                method: 'hatena',
                contentType: 'article',
                itemId: slug,
              })
            }
          >
            <HatenaIcon size={32} round={true} />
          </HatenaShareButton>
        </li>
        <li className={sharedStyles.socialButtonsItemLast}>
          <Like slug={slug} />
        </li>
      </ul>
    </>
  )
}

export default SocialButtons
