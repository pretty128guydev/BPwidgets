/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Implements a left-menu Sidebar
 */
import React, { useEffect, useState } from 'react'
import { t } from 'ttag'
import { connect } from 'react-redux'
import styled, { css } from 'styled-components'
import { ILeftPanel, IWalletDetails } from '../../core/API'
import { ReactComponent as NewsIcon } from './icons/left-menu-ico-news.svg'
import { ReactComponent as MarketsIcon } from './icons/left-menu-ico-markets.svg'
import { ReactComponent as TradeIcon } from './icons/left-menu-ico-trade.svg'
import { ReactComponent as DashboardIcon } from './icons/left-menu-ico-dashboard.svg'
import { ReactComponent as PositionsIcon } from './icons/left-menu-ico-positions.svg'
import { ReactComponent as TutorialIcon } from './icons/left-menu-ico-tutorial.svg'
import { ReactComponent as DailyAnalysis } from './icons/left-menu-ico-analysis.svg'
import { ReactComponent as VideoIcon } from './icons/left-menu-ico-video.svg'
import { ReactComponent as LeaderboardIcon } from './icons/left-menu-ico-leaderboard.svg'
import { ReactComponent as ChallengeDashboardIcon } from './icons/left-menu-ico-challenge-dashboard.svg'
import NewsPanel from './NewsPanel'
import VideoNews from './VideoNews'
import SignalsPanel from './SignalsPanel'
import TutorialsPanel from './TutorialsPanel'
import SocialPanel from './SocialPanel'
import { SidebarState } from '../../reducers/sidebar'
import { actionSetSidebar, actionSetOpenBottomTab } from '../../actions/sidebar'
import { IClosedTrade, IOpenTrade } from '../../core/interfaces/trades'
import { actionSetSelectedTrade } from '../../actions/trades'
import DailyAnalysisPanel from './DailyAnalysisPanel'
import { isLoggedIn } from '../selectors/loggedIn'
import { ContainerState } from '../../reducers/container'
import { actionSetContainer } from '../../actions/container'
import ReactTooltip from 'react-tooltip'
import LeaderBoard from './LeaderBoard'

const SIDEBAR_ITEMS: any = {
  0: 'Dashboard',
  2: `Positions`,
  3: 'News',
  4: 'Video News',
  5: 'Tutorials',
  6: 'Signals',
  8: 'Daily Analysis',
  9: 'Markets',
  10: 'Trade',
  11: 'Leaderboard',
  12: 'Challenge Dashboard',
}

const SidebarContainer = styled.div<any>`
  width: 86px;
  position: relative;
`

const SidebarPanel = styled.div<any>`
  box-sizing: border-box;
  height: 100%;
  background-color: ${(props) => props.colors.panelBackground};
  border-left: 1px solid ${(props) => props.colors.panelBorder};
  border-right: 1px solid ${(props) => props.colors.panelBorder};
  padding: 5px;
`

const Item = styled.div<any>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  width: 74px;
  height: 74px;
  cursor: pointer;
  position: relative;
  border-radius: 8px;
  margin-bottom: 5px;

  background-color: ${(props) =>
    props.active ? props.colors.tradebox.fieldBackground : 'transparent'};

  .item-name {
    margin-top: 5px;
    color: ${(props) => props.colors.sidebarLabelText};
    font-size: 11px;
    font-weight: 400;
  }

  ${(props) =>
    props.active
      ? css`
          .item-name {
            color: ${props.colors.accentDefault} !important;
          }

          path:not(.line) {
            fill: ${props.colors.accentDefault} !important;
          }

          path.line {
            stroke: ${props.colors.accentDefault} !important;
          }

          rect {
            fill: ${props.colors.accentDefault} !important;
          }
        `
      : css``}

  svg,
  img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
  }

  path:not(.line) {
    fill: ${(props) => props.colors.sidebarLabelText};
  }

  path.line {
    fill: none;
    stroke: ${(props) => props.colors.sidebarLabelText};
  }

  rect {
    fill: ${(props) => props.colors.sidebarLabelText};
  }

  &:hover {
    .item-name {
      color: ${(props) => props.colors.accentDefault};
    }

    path:not(.line) {
      fill: ${(props) => props.colors.accentDefault};
    }

    path.line {
      stroke: ${(props) => props.colors.accentDefault};
    }

    rect {
      fill: ${(props) => props.colors.accentDefault};
    }
  }
`

export const SidebarCaption = styled.h3<any>`
  display: block;
  box-sizing: border-box;
  width: 180px;
  height: 26px;
  padding-bottom: 11px;
  margin: 13px auto;
  font-size: 12px;
  font-weight: 500;
  font-style: normal;
  letter-spacing: -0.07px;
  text-align: center;
  text-transform: uppercase;

  color: ${(props) => props.colors.accentDefault};
  border-bottom: 1px solid ${(props) => props.colors.sidebarBorder};
`

export const VerticalFlexContainer = styled.div`
  display: flex;
  flex-direction: column;

  iframe {
    flex: 1 1 auto;
  }
`

const SidebarBanner = styled.div<{ colors: any }>`
  position: absolute;
  top: 7px;
  font-size: 9px;
  padding: 0 2px;
  border-radius: 2px;
  text-transform: uppercase;
  font-weight: bold;
  right: 7px;
  color: ${(props) => props.colors.panelBackground};
  background-color: ${(props) => props.colors.primary};
`

const SidebarCounter = styled.div<{ colors: any }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 7px;
  width: 18px;
  height: 18px;
  font-size: 12px;
  padding: 0 2px;
  right: 7px;
  border: 1px solid ${(props) => props.colors.primary};
  border-radius: 50%;
  color: ${(props) => props.colors.primary};
  background-color: ${(props) => props.colors.panelBackground};
`

interface ISidebarContentsProps {
  colors: any
  value: SidebarState
  onChange: (value: SidebarState) => void
  actionSetSelectedTrade: (trade: IOpenTrade | IClosedTrade | null) => void
}

const SidebarContents = ({
  colors,
  value,
  onChange,
  actionSetSelectedTrade,
}: ISidebarContentsProps) => {
  const closeSidebar = () => {
    onChange(SidebarState.none)
    actionSetSelectedTrade(null)
  }

  const isVisible = (panel: SidebarState) => value === panel
  return (
    <div style={{ width: '58px' }}>
      {isVisible(SidebarState.tutorial) && (
        <TutorialsPanel colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.video) && (
        <VideoNews colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.news) && (
        <NewsPanel colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.signals) && (
        <SignalsPanel colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.social) && (
        <SocialPanel colors={colors} onClose={closeSidebar} />
      )}

      {isVisible(SidebarState.analysis) && (
        <DailyAnalysisPanel
          forceLoad={true}
          colors={colors}
          onClose={closeSidebar}
        />
      )}
      {isVisible(SidebarState.leaderboard) && (
        <LeaderBoard colors={colors} onClose={closeSidebar} />
      )}
    </div>
  )
}

interface ISidebarProps {
  leftPanel: ILeftPanel
  state: SidebarState
  isLoggedIn: boolean
  colors: any
  container: ContainerState
  openTradesCount: number
  actionSetSidebar: (state: SidebarState) => void
  actionSetOpenBottomTab: (isOpen: boolean) => void
  actionSetContainer: (state: ContainerState) => void
  actionSetSelectedTrade: (trade: IOpenTrade | IClosedTrade | null) => void
  lang: string
  openBottomTab: boolean
  activeWallet: IWalletDetails
}

/**
 * Abstraction to handle tooltip and active state
 */
const SidebarPanelItem = ({
  state,
  value,
  onChange,
  icon,
  colors,
  banner,
  counter,
  tooltipName,
}: any) => (
  <Item
    colors={colors}
    active={state === value}
    onClick={() => onChange(value)}
  >
    {icon}
    <span className="item-name">{tooltipName}</span>
    {banner && <SidebarBanner colors={colors}>{banner}</SidebarBanner>}
    {counter && <SidebarCounter colors={colors}>{counter}</SidebarCounter>}
  </Item>
)

const SidebarNew = (props: ISidebarProps) => {
  const { leftPanel, state, colors, isLoggedIn, activeWallet } = props
  const anyNews = leftPanel.news?.enabled || leftPanel.cryptoNews?.enabled
  const videoNews = leftPanel.videoNews?.enabled
  const signals = !!leftPanel.signalsSrc
  const social = leftPanel.allowSocial === 1
  const dailyAnalysis = leftPanel.dailyAnalysis?.enabled
  const tutorials = leftPanel.videos?.enabled
  const dashboard = leftPanel.dashboard?.enabled || true
  const leaderboard = leftPanel.leaderboard?.enabled && isLoggedIn

  const getTranslatedName = (name: string) => {
    switch (name) {
      case 'Dashboard':
        return t`Dashboard`
      case 'Positions':
        return t`Positions`
      case 'News':
        return t`News`
      case 'Video News':
        return t`Video News`
      case 'Tutorials':
        return t`Tutorials`
      case 'Signals':
        return t`Signals`
      case 'Daily Analysis':
        return t`Daily Analysis`
      case 'Markets':
        return t`Markets`
      case 'Trade':
        return t`Trade`
      case 'Leaderboard':
        return t`Leaderboard`
      case 'Challenge Dashboard':
        return t`Challenge Dashboard`
    }
  }

  const [sidebarItems, setSidebarItems] = useState<any>(() => {
    let data: any = {}
    Object.keys(SIDEBAR_ITEMS).forEach((k: any) => {
      const name = getTranslatedName(SIDEBAR_ITEMS[k])
      data[k] = name
    })
    return data
  })

  useEffect(() => {
    setSideBar(SidebarState.none)
  }, [props.container])

  useEffect(() => {
    let data: any = {}
    Object.keys(SIDEBAR_ITEMS).forEach((k: any) => {
      const name = getTranslatedName(SIDEBAR_ITEMS[k])
      data[k] = name
    })
    setSidebarItems(data)
  }, [props.lang])

  const setSideBar = (value: SidebarState) => {
    if (value === props.state) {
      props.actionSetSidebar(SidebarState.trade)

      if (
        value === SidebarState.dashboard ||
        value === SidebarState.markets ||
        value === SidebarState.challengeDashboard
      ) {
        props.actionSetContainer(ContainerState.trade)
      }

      return
    }

    if (value === SidebarState.none) {
      switch (props.container) {
        case ContainerState.dashboard:
          props.actionSetSidebar(SidebarState.dashboard)
          break
        case ContainerState.assets:
          props.actionSetSidebar(SidebarState.markets)
          break
        case ContainerState.trade:
          props.actionSetSidebar(SidebarState.trade)
      }
      return
    }

    switch (value) {
      case SidebarState.dashboard:
        props.actionSetContainer(ContainerState.dashboard)
        break
      case SidebarState.markets:
        props.actionSetContainer(ContainerState.assets)
        break
      case SidebarState.challengeDashboard:
        props.actionSetContainer(ContainerState.challengeDashboard)
        break
      case SidebarState.trade:
        props.actionSetContainer(ContainerState.trade)
        break
    }

    props.actionSetSidebar(value)
  }

  return (
    <SidebarContainer className="sidebar__panel" colors={colors}>
      <SidebarPanel colors={colors}>
        {isLoggedIn && !activeWallet?.challengeID && dashboard && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.dashboard}
            tooltipName={sidebarItems[SidebarState.dashboard]}
            onChange={setSideBar}
            icon={<DashboardIcon />}
          />
        )}

        {isLoggedIn && activeWallet?.challengeID && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.challengeDashboard}
            tooltipName={sidebarItems[SidebarState.challengeDashboard]}
            onChange={setSideBar}
            icon={<ChallengeDashboardIcon />}
          />
        )}

        <SidebarPanelItem
          colors={colors}
          state={state}
          value={SidebarState.markets}
          tooltipName={sidebarItems[SidebarState.markets]}
          onChange={setSideBar}
          icon={<MarketsIcon />}
        />

        <SidebarPanelItem
          colors={colors}
          state={state}
          value={SidebarState.trade}
          tooltipName={sidebarItems[SidebarState.trade]}
          onChange={setSideBar}
          icon={<TradeIcon />}
        />

        {isLoggedIn && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.positions}
            tooltipName={sidebarItems[SidebarState.positions]}
            // onChange={() => props.actionSetOpenBottomTab(!props.openBottomTab)}
            onChange={setSideBar}
            counter={props.openTradesCount !== 0 ? props.openTradesCount : null}
            icon={<PositionsIcon />}
          />
        )}
        {leaderboard && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            banner={t`new`}
            value={SidebarState.leaderboard}
            tooltipName={sidebarItems[SidebarState.leaderboard]}
            onChange={setSideBar}
            icon={<LeaderboardIcon />}
          />
        )}
        {anyNews && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.news}
            tooltipName={sidebarItems[SidebarState.news]}
            onChange={setSideBar}
            icon={<NewsIcon />}
          />
        )}

        {videoNews && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.video}
            tooltipName={sidebarItems[SidebarState.video]}
            onChange={setSideBar}
            icon={<VideoIcon />}
          />
        )}
        {dailyAnalysis && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.analysis}
            tooltipName={sidebarItems[SidebarState.analysis]}
            onChange={setSideBar}
            icon={<DailyAnalysis />}
          />
        )}
        {signals && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.signals}
            tooltipName={sidebarItems[SidebarState.signals]}
            onChange={setSideBar}
            icon={<VideoIcon />}
          />
        )}
        {social && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.social}
            tooltipName={sidebarItems[SidebarState.social]}
            onChange={setSideBar}
            icon={<VideoIcon />}
          />
        )}
        {tutorials && (
          <SidebarPanelItem
            colors={colors}
            state={state}
            value={SidebarState.tutorial}
            tooltipName={sidebarItems[SidebarState.tutorial]}
            onChange={setSideBar}
            icon={<TutorialIcon />}
          />
        )}
      </SidebarPanel>
      <SidebarContents
        colors={colors}
        value={state}
        onChange={setSideBar}
        actionSetSelectedTrade={props.actionSetSelectedTrade}
      />
    </SidebarContainer>
  )
}

const mapStateToProps = (state: any) => ({
  leftPanel: state.registry.data.partnerConfig.leftPanel,
  state: state.sidebar.panel,
  colors: state.theme,
  isLoggedIn: isLoggedIn(state),
  container: state.container.content,
  openTradesCount: state.trades.open?.length,
  lang: state.registry.data.lang,
  openBottomTab: state.sidebar.openBottomTab,
  activeWallet: state.wallets.activeWallet,
})

export default connect(mapStateToProps, {
  actionSetSidebar,
  actionSetOpenBottomTab,
  actionSetSelectedTrade,
  actionSetContainer,
})(SidebarNew)
