import React from 'react'

import * as gtag from '../lib/gtag'
import styles from '../styles/like-button.module.css'
import Heart from './svgs/heart'

type Props = {
  id: string
}

type State = {
  active: number
}

class LikeButton extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      active: 0,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    gtag.like({
      contentType: 'article',
      itemId: this.props.id,
    })
    this.setState({ active: 1 })
  }

  render() {
    return (
      <button className={styles.likeButton} onClick={this.handleClick}>
        <Heart width={32} height={32} active={this.state.active} />
      </button>
    )
  }
}

export default LikeButton
