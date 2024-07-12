/**
 * Mobile app bundle
 */
import React, { useEffect, useState } from 'react'
import Modal from './components/Modal'
import ChartContainer from './components/ChartContainer/index'
import AlertsBar from './components/AlertsBar'
import * as Mobile from './components/Mobile'
import './core/i18n'
import { Background } from './App'
import TradeSubmitModal from './components/notifications/TradeSubmit'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import { SidebarState } from './reducers/sidebar'
import VideoNews from './components/Sidebar/VideoNews'
import NewsPanel from './components/Sidebar/NewsPanel'
import DailyAnalysisPanel from './components/Sidebar/DailyAnalysisPanel'
import disableScroll from 'disable-scroll'
import LeaderBoard from './components/Sidebar/LeaderBoard'
import { isMobileLandscape } from './core/utils'
import TradeBoxNonMargin from './components/TradeBoxFx/TradeBoxNonMargin'
import TradeBoxFx from './components/TradeBoxFx'
import { actionCloseModal, actionShowModal, ModalTypes } from './actions/modal'
import IframePanel from './components/Sidebar/IframePanel'
import Challenge from './components/SideMenuBar/Challenge'

enum MobileDrawers {
  none,
  menu,
  dashboard,
  positions,
  homeMenu,
  trade,
  news,
  videoNews,
  dailyAnalysis,
  leaderboard,
  searchAssets,
  challengeDashboard,
  iframePanel,
}

interface IMobileAppProps {
  showHeader: boolean
  colors: any
  showPositionsPanel: boolean
  onHidePositionsPanel: () => void
  actionCloseModal: () => void
  partnerConfig: any
  activeWallet: any
  actionShowModal: any
  isLoggedIn: boolean
  showChallenge: boolean
}

const NotificationsWrapper = styled.div`
  position: absolute;
  display: block;
  top: -30px;
  width: 100%;
`

const MobileWrapper = styled.div`
  ${isMobileLandscape(true)
    ? css`
        @media (orientation: landscape) {
          display: flex;
          flex-direction: row;
        }
      `
    : ``}

  .chartContainer {
    ${isMobileLandscape(true)
      ? css`
          @media (orientation: landscape) {
            width: 100%;
          }
        `
      : ``}
  }
`

/**
 * A seperate component for mobile app
 * Could be loaded via Suspense API
 */
const MobileApp = ({
  showHeader,
  colors,
  showPositionsPanel,
  onHidePositionsPanel,
  partnerConfig,
  activeWallet,
  actionShowModal,
  isLoggedIn,
  showChallenge,
  actionCloseModal,
}: IMobileAppProps) => {
  const [activePanel, setActive] = useState<MobileDrawers>(MobileDrawers.none) // state for all drawers

  const [iframeLink, setIframeLink] = useState<any>('')

  const { tradingPanelType } = partnerConfig

  useEffect(() => {
    const favicon = document.getElementById('favicon') as any
    favicon.href = partnerConfig.favicon
    document.title = partnerConfig.title || 'Trading'

    const { xprops } = window as any

    if (xprops && !xprops.header) return

    if (window.location.search.includes('show-login') && !isLoggedIn) {
      actionShowModal(ModalTypes.SIGN_IN)
      return
    }

    if (window.location.search.includes('show-register') && !isLoggedIn) {
      actionShowModal(ModalTypes.OPEN_ACCOUNT)
      return
    }
  }, [])

  useEffect(() => {
    if (showChallenge) {
      setIframeLink(<Challenge onClose={() => setIframeLink('')} />)
      setActive(MobileDrawers.iframePanel)
    }
  }, [showChallenge])

  useEffect(() => {
    const mobile = isMobile()
    activePanel === MobileDrawers.homeMenu && !isMobileLandscape(mobile)
      ? disableScroll.on()
      : disableScroll.off()
  }, [activePanel])

  const isMobile = () => {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ]

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem)
    })
  }

  return (
    <Background isMobile={true}>
      <MobileWrapper>
        <div className="chartContainer">
          {activeWallet.isMargin ? (
            <Mobile.Header
              showHeader={showHeader}
              onMenuClick={() => {
                setActive(MobileDrawers.menu)
              }}
              onHomeButtonClick={() => {
                setActive(
                  activePanel === MobileDrawers.homeMenu
                    ? MobileDrawers.none
                    : MobileDrawers.homeMenu
                )
              }}
              onSearchAssetsButtonClick={() => {
                setActive(
                  activePanel === MobileDrawers.searchAssets
                    ? MobileDrawers.none
                    : MobileDrawers.searchAssets
                )
              }}
              onUserMenuClick={() => setActive(MobileDrawers.dashboard)}
              activePanel={activePanel}
            />
          ) : (
            <Mobile.HeaderNonMargin
              showHeader={showHeader}
              onHomeButtonClick={() => {
                setActive(
                  activePanel === MobileDrawers.homeMenu
                    ? MobileDrawers.none
                    : MobileDrawers.homeMenu
                )
              }}
              onSearchAssetsButtonClick={() => {
                setActive(
                  activePanel === MobileDrawers.searchAssets
                    ? MobileDrawers.none
                    : MobileDrawers.searchAssets
                )
              }}
              onMenuClick={() => {
                setActive(MobileDrawers.menu)
              }}
              onUserMenuClick={() => setActive(MobileDrawers.dashboard)}
              activePanel={activePanel}
            />
          )}
          <ChartContainer isMobile={true} />
          <Modal />
          <AlertsBar />
          {activePanel === MobileDrawers.dashboard ? (
            activeWallet.isMargin ? (
              <Mobile.Dashboard onClose={() => setActive(MobileDrawers.none)} />
            ) : (
              <Mobile.DashboardNonMargin
                onClose={() => setActive(MobileDrawers.none)}
              />
            )
          ) : null}
          {(activePanel === MobileDrawers.positions || showPositionsPanel) && (
            <Mobile.Positions
              onClose={() => {
                setActive(MobileDrawers.none)
                onHidePositionsPanel()
              }}
              onBack={() => setActive(MobileDrawers.homeMenu)}
              isMobile={true}
            />
          )}
          {activePanel === MobileDrawers.menu && (
            <Mobile.Drawer
              onClose={() => setActive(MobileDrawers.none)}
              setShowMenuContent={(link: any) => {
                setActive(MobileDrawers.iframePanel)
                setIframeLink(link)
              }}
            />
          )}
          {activePanel === MobileDrawers.homeMenu && (
            <Mobile.HomeMenu
              mobileDrawers={MobileDrawers}
              setActive={setActive}
            />
          )}
          {activePanel === MobileDrawers.videoNews && (
            <VideoNews
              colors={colors}
              onClose={() => setActive(MobileDrawers.none)}
              isMobile={true}
            />
          )}
          {activePanel === MobileDrawers.news && (
            <NewsPanel
              colors={colors}
              onClose={() => setActive(MobileDrawers.none)}
              isMobile={true}
            />
          )}
          {activePanel === MobileDrawers.dailyAnalysis && (
            <DailyAnalysisPanel
              forceLoad={true}
              colors={colors}
              isMobile={true}
              onClose={() => setActive(MobileDrawers.none)}
            />
          )}
          {activePanel === MobileDrawers.leaderboard && (
            <LeaderBoard
              colors={colors}
              isMobile={true}
              onClose={() => setActive(MobileDrawers.none)}
            />
          )}
          {activePanel === MobileDrawers.searchAssets && (
            <Mobile.SearchAssets
              onClose={() => setActive(MobileDrawers.none)}
            />
          )}
          {activePanel === MobileDrawers.challengeDashboard && (
            <Mobile.ChallengeDashboard
              onClose={() => setActive(MobileDrawers.none)}
            />
          )}
          {activePanel === MobileDrawers.iframePanel && (
            <IframePanel
              colors={colors}
              isMobile={true}
              onClose={() => {
                setActive(MobileDrawers.none)
                actionCloseModal()
              }}
              link={iframeLink}
            />
          )}
        </div>
        <div style={{ position: 'relative' }}>
          {activeWallet.isMargin ? (
            <TradeBoxFx isMobile={true} />
          ) : tradingPanelType === 1 ? (
            <TradeBoxNonMargin isMobile={true} />
          ) : (
            <TradeBoxFx isMobile={true} />
          )}
          <NotificationsWrapper>
            <TradeSubmitModal />
          </NotificationsWrapper>
        </div>
      </MobileWrapper>
    </Background>
  )
}

const mapStateToProps = (state: any) => ({
  showPositionsPanel: state.sidebar.panel === SidebarState.positions,
  partnerConfig: state.registry.data.partnerConfig,
  activeWallet: state.wallets.activeWallet,
  showChallenge: state.container.showChallenge,
})

export default connect(mapStateToProps, { actionShowModal, actionCloseModal })(
  MobileApp
)
