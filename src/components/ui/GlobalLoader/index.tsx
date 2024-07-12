/**
 * Implements a global loader from bpFxCfd
 * Uses bodymovin library which contains definition
 */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { createGlobalStyle } from 'styled-components'
import * as bodymovin from 'bodymovin'
import './styles.scss'

interface IGlobalLoaderProps {
  theme: any
  zIndex?: number
  containerId?: string
  loaderWidth?: number
}

const GlobalStyle = createGlobalStyle<{ color: string }>`
	.bg-loader-container svg path {
    	fill: ${(props) => props.color};
	}
`

/**
 * Keep in mind:
 * Default zIndex for GlobalLoader is 100 (to overlay all stuff except theme editor)
 * Should be reduced for chart to 40
 */
const GlobalLoader = ({
  theme,
  zIndex,
  containerId,
  loaderWidth,
}: IGlobalLoaderProps) => {
  useEffect(() => {
    bodymovin.loadAnimation({
      container: document.getElementById(containerId || 'mainLoader'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('./data.json'),
    })
    bodymovin.play()

    return () => {
      bodymovin.stop()
    }
  }, [])

  const styles = {
    backgroundColor: theme.backgroundDefault,
    zIndex: zIndex ? zIndex : 100,
  }

  return (
    <div className="bg-loader-container" style={styles}>
      <GlobalStyle color={theme.primary} />
      <div
        className="main-loader"
        id={containerId || 'mainLoader'}
        style={{ width: loaderWidth || 130 }}
      />
    </div>
  )
}

const mapStateToProps = (state: any) => ({ theme: state.theme })

export default connect(mapStateToProps)(GlobalLoader)
