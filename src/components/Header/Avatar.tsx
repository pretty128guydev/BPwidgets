/**
 * Handles case when we can't load image
 */
import React, { Component } from 'react'
import { isMobileLandscape } from '../../core/utils'

interface IAvatarProps {
  src: string
  isMobile: boolean
}

export default class Avatar extends Component<IAvatarProps, any> {
  constructor(props: IAvatarProps) {
    super(props)
    this.state = {
      error: false,
    }
  }
  onError = () => {
    this.setState({ error: true })
  }
  render() {
    const { src } = this.props
    if (this.state.error || !src) {
      return <div className="avatar_fallback" />
    }
    return (
      <>
        <img
          width={isMobileLandscape(this.props.isMobile) ? 30 : 40}
          height={isMobileLandscape(this.props.isMobile) ? 30 : 40}
          src={src}
          alt="avatar"
          style={{
            marginTop: isMobileLandscape(this.props.isMobile) ? 5 : 10,
            borderRadius: '50%',
          }}
          onError={this.onError}
        />
        {isMobileLandscape(this.props.isMobile) && (
          <span style={{ marginLeft: 10, color: 'white', fontSize: 16 }}>
            ▾
          </span>
        )}
      </>
    )
  }
}
