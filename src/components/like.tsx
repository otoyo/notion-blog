import React from 'react'

import * as gtag from '../lib/gtag'
import sharedStyles from '../styles/shared.module.css'
import Heart from './svgs/heart'

class Like extends React.Component {
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
      itemId: this.props.slug,
    })
    this.setState({ active: 1 })
  }

  render() {
    return (
      <>
        <button className={sharedStyles.likeButton} onClick={this.handleClick}>
          <Heart width={32} height={32} active={this.state.active} />
        </button>
      </>
    )
  }
}

export default Like
