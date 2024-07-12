/**
 * Implements a news panel
 * Shows tabs only if news and crypto enabled
 */
import React from 'react'
import CloseButton from '../CloseBtn'
import SidebarContentsPanel from '../SidebarContentsPanel'

interface IIframePanelProps {
  link: string
  onClose: () => void
  isMobile?: boolean
  colors: any
}

const IframePanel = (props: IIframePanelProps) => {
  const { link } = props

  return (
    <SidebarContentsPanel
      colors={props.colors}
      adjustable={false}
      isMobile={props.isMobile || false}
    >
      <CloseButton colors={props.colors} onClick={props.onClose} />
      {typeof props.link === 'object' ? (
        link
      ) : (
        <iframe
          src={props.link}
          title="Trading iframe"
          frameBorder="0"
          height="100%"
          width="100%"
        />
      )}
    </SidebarContentsPanel>
  )
}

export default IframePanel
