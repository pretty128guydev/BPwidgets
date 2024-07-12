/**
 * Component which contains assets bar and a chart
 */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { isLoggedIn } from '../selectors/loggedIn'
import { isMobileLandscape } from '../../core/utils'
import ChartTradingView from './ChartTradingView'
import { ChartLibraryConfig, ChartType } from './ChartLibraryConfig'
import ChartTradingViewPro from './ChartTradingViewPro'
import GlobalLoader from '../ui/GlobalLoader'

const MobileChartArea = styled.section<{
  loggedIn: boolean
  isMobile: boolean
}>`
  flex: 1 1 auto;
  display: flex;
  position: relative;
  ${(props) =>
    props.isMobile
      ? window.innerHeight < 660
        ? css`
            height: 332px;
            ${isMobileLandscape(props.isMobile)
              ? css`
                  @media (orientation: landscape) {
                    height: calc(
                      ${window.innerHeight}px -
                        ${({ loggedIn }: any) => (loggedIn ? 90 : 44)}px
                    );
                  }
                `
              : ``}
          `
        : css`
            height: calc(
              ${window.innerHeight}px -
                ${({ loggedIn }: any) => (loggedIn ? 358 : 320)}px
            );
            ${isMobileLandscape(props.isMobile)
              ? css`
                  @media (orientation: landscape) {
                    height: calc(
                      ${window.innerHeight}px -
                        ${({ loggedIn }: any) => (loggedIn ? 90 : 44)}px
                    );
                  }
                `
              : ``}
          `
      : css``}
`

const ChartArea = styled.div<{ colors: any }>`
  background-color: ${(props) => props.colors.backgroundHue1};
  border-bottom: 1px solid ${(props) => props.colors.backgroundHue3};

  display: flex;
  flex-direction: column;
  position: relative;
  height: calc(100% - 40px);
`

interface IChartContainer {
  isMobile: boolean
  colors: any
  loggedIn: boolean
  chartLibraryConfig: ChartLibraryConfig
}

const ChartContainer = (props: IChartContainer) => {
  const [chartReady, setChartReady] = useState(false)

  if (props.isMobile) {
    return (
      <>
        <MobileChartArea loggedIn={props.loggedIn} isMobile={props.isMobile}>
          {(props.chartLibraryConfig?.defaultLibrary === ChartType.Basic ||
            props.chartLibraryConfig?.defaultLibrary ===
              ChartType.LightWeight ||
            props.chartLibraryConfig?.defaultLibrary ===
              ChartType.TradingView) && (
            <ChartTradingView
              isMobile={props.isMobile}
              interval={props.chartLibraryConfig?.defaultTime}
            />
          )}
          {props.chartLibraryConfig?.defaultLibrary ===
            ChartType.TradingViewPro && (
            <ChartTradingViewPro
              isMobile={props.isMobile}
              interval={props.chartLibraryConfig?.defaultTime}
            />
          )}
        </MobileChartArea>
      </>
    )
  }

  return (
    <ChartArea colors={props.colors}>
      {(props.chartLibraryConfig?.defaultLibrary === ChartType.Basic ||
        props.chartLibraryConfig?.defaultLibrary === ChartType.LightWeight ||
        props.chartLibraryConfig?.defaultLibrary === ChartType.TradingView) && (
        <ChartTradingView
          isMobile={props.isMobile}
          interval={props.chartLibraryConfig?.defaultTime}
        />
      )}
      {props.chartLibraryConfig?.defaultLibrary ===
        ChartType.TradingViewPro && (
        <>
          <ChartTradingViewPro
            isMobile={props.isMobile}
            onChartReady={setChartReady}
            chartReady={chartReady}
            interval={props.chartLibraryConfig?.defaultTime}
          />
          {!chartReady && <GlobalLoader />}
        </>
      )}
    </ChartArea>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  loggedIn: isLoggedIn(state),
  chartLibraryConfig: state.registry.data.partnerConfig.chartLibraryConfig,
})

export default connect(mapStateToProps)(ChartContainer)
