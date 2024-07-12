/**
 * Implements a Sidebar component with Tabs
 * Handles interaction
 * Single position item located in PositionItem
 */
import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import SidebarContentsPanel from './SidebarContentsPanel'
import styled, { css } from 'styled-components'
import { ReactComponent as DailyAnalysisIcon } from './icon-daily-analysis.svg'
import { ReactComponent as NewsIcon } from './icon-news.svg'
import { ReactComponent as PositionsIcon } from './icon-positions.svg'
import { ReactComponent as TradeIcon } from './icon-trade.svg'
import { ReactComponent as VideosIcon } from './icon-videos.svg'
import { ReactComponent as DashboardIcon } from './icon-dashboard.svg'
import { ReactComponent as ChallengeDashboardIcon } from './icon-challenge-dashboard.svg'
import { ITradesState } from '../../../reducers/trades'
import { isMobileLandscape } from '../../../core/utils'
import { IWalletDetails } from '../../../core/API'
import { isLoggedIn } from '../../selectors/loggedIn'

interface IHomeMenuPanel {
  colors: any
  isMobile: boolean
  trades: ITradesState
  setActive: any
  mobileDrawers: any
  openTradesCount: number
  leftPanelConfig: any
  activeWallet: IWalletDetails
  isLoggedIn: boolean
}

const MENU_ITEMS = [
  {
    label: t`Trade`,
    icon: TradeIcon,
  },
  {
    label: t`Positions`,
    icon: PositionsIcon,
  },
  {
    label: t`News`,
    icon: NewsIcon,
  },
  {
    label: t`Video News`,
    icon: VideosIcon,
  },
  {
    label: t`Dashboard`,
    icon: DashboardIcon,
  },
  {
    label: t`Daily Analysis`,
    icon: DailyAnalysisIcon,
  },
]

const CHALLENGE_MENU_ITEMS = [
  {
    label: t`Trade`,
    icon: TradeIcon,
  },
  {
    label: t`Positions`,
    icon: PositionsIcon,
  },
  {
    label: t`News`,
    icon: NewsIcon,
  },
  {
    label: t`Video News`,
    icon: VideosIcon,
  },
  {
    label: t`Challenge Dashboard`,
    icon: ChallengeDashboardIcon,
  },
  {
    label: t`Daily Analysis`,
    icon: DailyAnalysisIcon,
  },
]

const MenuItemsContainer = styled.div<any>`
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
  margin-top: 38px;
  justify-content: center;

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            overflow: auto;
          }
        `
      : css``}
`

const ItemContainer = styled.div<any>`
  display: flex;
  flex-direction: column;
  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          width: 33%;
          @media (orientation: landscape) {
            width: 24%;
          }
        `
      : css`
          width: 33%;
        `}
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.isActive ? props.colors.primaryText : props.colors.accentDefault};
  background-color: ${(props) =>
    /*props.isActive ? '#263346' : */ 'transparent'};
  padding: 20px;
  border-radius: 4px;

  path:not(.line) {
    fill: ${(props) =>
      props.isActive ? props.colors.primaryText : props.colors.accentDefault};
  }

  path.line {
    fill: none;
    stroke: ${(props) =>
      props.isActive ? props.colors.primaryText : props.colors.accentDefault};
  }

  &:hover {
    color: ${(props) => props.colors.primaryText};

    path:not(.line) {
      fill: ${(props) => props.colors.primaryText};
    }

    path.line {
      stroke: ${(props) => props.colors.primaryText};
    }
  }
`

const ItemLabel = styled.span<any>`
  text-align: center;
  margin-top: 15px;
  font-size: 16px;
  font-weight: 500;
`

const Caption = styled.div<any>`
  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          margin: '30px 0 33px 0';
          @media (orientation: landscape) {
            margin: 16px;
          }
        `
      : css`
          margin: '30px 0 33px 0';
        `}
  color: ${(props) => props.colors.primaryText};
  font-size: 32px;
  font-weight: 700;
  text-align: center;
`

const RelativePosition = styled.div<any>`
  position: relative;
`

const SidebarCounter = styled.div<{ colors: any }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -20px;
  right: -20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 16px;
  border: 2px solid ${(props) => props.colors.accentDefault};
  color: ${(props) => props.colors.accentDefault};
  background-color: ${(props) => props.colors.backgroundHue1};
`

const HomeMenuPanel = (props: IHomeMenuPanel) => {
  const {
    leftPanelConfig,
    activeWallet,
    setActive,
    colors,
    openTradesCount,
    isMobile,
    mobileDrawers,
    isLoggedIn,
  } = props

  const anyNews =
    leftPanelConfig.news?.enabled || leftPanelConfig.cryptoNews?.enabled
  const videoNews = leftPanelConfig.videoNews?.enabled
  const dailyAnalysis = leftPanelConfig.dailyAnalysis?.enabled
  const dashboard = leftPanelConfig.dashboard?.enabled || true
  const leaderboard = leftPanelConfig.leaderboard?.enabled && isLoggedIn

  const getMobileDrawersItem = (label: string) => {
    switch (label) {
      case t`Dashboard`:
        return mobileDrawers.dashboard
      case t`Challenge Dashboard`:
        return mobileDrawers.challengeDashboard
      case t`Trade`:
        return mobileDrawers.none
      case t`Positions`:
        return mobileDrawers.positions
      case t`News`:
        return mobileDrawers.news
      case t`Video News`:
        return mobileDrawers.videoNews
      case t`Daily Analysis`:
        return mobileDrawers.dailyAnalysis
      case t`Leaderboard`:
        return mobileDrawers.leaderboard
    }
  }

  return (
    <SidebarContentsPanel
      colors={colors}
      isMobile={isMobile}
      adjustable={false}
    >
      {/* <Caption colors={colors}>{t`Home`}</Caption> */}
      <MenuItemsContainer isMobile={isMobile}>
        {(activeWallet?.challengeID ? CHALLENGE_MENU_ITEMS : MENU_ITEMS).map(
          (item: any) => {
            const Icon = item.icon
            const mobileDrawersItem = getMobileDrawersItem(item.label)

            if (
              (!dailyAnalysis && item.label === t`Daily Analysis`) ||
              (!dashboard && item.label === t`Dashboard`) ||
              (!videoNews && item.label === t`Video News`) ||
              (!anyNews && item.label === t`News`) ||
              (!leaderboard && item.label === t`Leaderboard` && isLoggedIn)
            )
              return <></>

            return (
              <ItemContainer
                colors={colors}
                onClick={() => {
                  setActive(mobileDrawersItem)
                }}
                isActive={item.label === t`Trade`}
                isMobile={isMobile}
              >
                {item.label === t`Positions` ? (
                  <RelativePosition>
                    <Icon />
                    {openTradesCount && openTradesCount > 0 ? (
                      <SidebarCounter colors={colors}>
                        {openTradesCount}
                      </SidebarCounter>
                    ) : null}
                  </RelativePosition>
                ) : (
                  <Icon />
                )}
                <ItemLabel>{item.label}</ItemLabel>
              </ItemContainer>
            )
          }
        )}
      </MenuItemsContainer>
    </SidebarContentsPanel>
  )
}

const mapStateToProps = (state: any) => ({
  trades: state.trades,
  openTradesCount: state.trades.open?.length,
  leftPanelConfig: state.registry.data.partnerConfig.leftPanel,
  activeWallet: state.wallets.activeWallet,
  isLoggedIn: isLoggedIn(state),
})

export default connect(mapStateToProps, {})(HomeMenuPanel)
