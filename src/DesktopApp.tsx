/**
 * Entry component for desktop layout
 */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from './components/Modal'
import Header from './components/Header'
import AccountBar from './components/AccountBar'
import Sidebar from './components/Sidebar'
import ChartContainer from './components/ChartContainer/index'
import AlertsBar from './components/AlertsBar'
import './core/i18n'
import { Background } from './App'
import { connect } from 'react-redux'
import { ContainerState } from './reducers/container'
import DashboardPanel from './components/Dashboard'
import AssetsPanel from './components/Assets'
import { SidebarState } from './reducers/sidebar'
import { actionSetContainer } from './actions/container'
import { actionSetSidebar } from './actions/sidebar'
import InstrumentsBar from './components/ChartContainer/InstrumentsBar'
import TradePanel from './components/TradePanel/TradePanel'
import TradeBoxFX from './components/TradeBoxFx'
import TradeBoxNonMargin from './components/TradeBoxFx/TradeBoxNonMargin'
import TradePanelNonMargin from './components/TradePanel/TradePanelNonMargin'
import AccountBarNonMargin from './components/AccountBarNonMargin'
import ChallengeDashboard from './components/ChallengeDashboard'
import { actionCloseModal, actionShowModal, ModalTypes } from './actions/modal'
import SideMenuBar from './components/SideMenuBar'
import SidebarNew from './components/SidebarNew'
import Challenge from './components/SideMenuBar/Challenge'
import ChallengeDashboardNonMargin from './components/ChallengeDashboardNonMargin'
import CloseBtnRound from './components/SidebarNew/CloseBtnRound'

const DesktopGrid = styled.section<any>`
  display: flex;
  flex: 1 1 auto;
  border-top: 1px solid ${(props) => props.colors.backgroundHue3};
  position: relative;
`

const Content = styled.div<any>`
  display: flex;
  flex-direction: row;
  width: calc(
    100vw -
      ${(props) =>
        props.showSideMenu ? (props.collapsedSideMenu ? 128 : 282) : 86}px
  );
  height: 100%;
  position: relative;
`

const SideMenuContent = styled.div<any>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  background-color: ${(props) => props.colors.backgroundHue1};

  .content-container {
    width: 100%;
    height: 100%;
  }
`

const TradeGrid = styled.div<any>`
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: auto min-content;
  grid-template-rows: 100%;
  height: calc(
    100vh -
      ${(props) =>
        props.showHeader
          ? props.isLoggedIn
            ? 117
            : 65
          : props.isLoggedIn
          ? 51
          : 0}px
  );
  max-height: calc(
    100vh -
      ${(props) =>
        props.showHeader
          ? props.isLoggedIn
            ? 117
            : 65
          : props.isLoggedIn
          ? 51
          : 0}px
  );
`

const DesktopApp = ({
  isLoggedIn,
  theme,
  showHeader,
  container,
  actionSetContainer,
  actionSetSidebar,
  partnerConfig,
  activeWallet,
  sidebarState,
  actionShowModal,
  actionCloseModal,
  showSideMenu,
  collapsedSideMenu,
  showChallenge,
}: any) => {
  const onClose = () => {
    actionSetSidebar(SidebarState.none)
    actionSetContainer(ContainerState.trade)
  }

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
    if (showChallenge)
      setShowMenuContent({
        show: true,
        link: '',
        component: <Challenge onClose={() => setShowMenuContent(null)} />,
      })
  }, [showChallenge])

  const [showMenuContent, setShowMenuContent] = useState<{
    show: boolean
    link: string
    component?: any
  } | null>(null)

  const [showOtherPlatform, setShowOtherPlatform] = useState<{
    show: boolean
    link: string
  } | null>(null)

  const { tradingPanelType } = partnerConfig

  return (
    <Background>
      <div className="container-1">
        {showHeader && (
          <Header
            setShowMenuContent={setShowMenuContent}
            setShowOtherPlatform={setShowOtherPlatform}
          />
        )}
        <div className="container-2">
          {showSideMenu && (
            <SideMenuBar
              setShowMenuContent={setShowMenuContent}
              showMenuContent={showMenuContent?.show}
            />
          )}
          <div className="container-3">
            {isLoggedIn && !showOtherPlatform?.show ? (
              activeWallet.isMargin ? (
                <AccountBar />
              ) : (
                <AccountBarNonMargin />
              )
            ) : null}
            <DesktopGrid colors={theme}>
              {showOtherPlatform?.show && (
                <iframe
                  src={showOtherPlatform?.link}
                  title="Trading iframe"
                  frameBorder="0"
                  height="100%"
                  width="100%"
                />
              )}
              {showMenuContent?.show && (
                <SideMenuContent colors={theme}>
                  <div className="content-container">
                    <CloseBtnRound
                      colors={theme}
                      onClick={() => {
                        setShowMenuContent(null)
                        actionCloseModal()
                      }}
                      top={5}
                      right={20}
                    />
                    {showMenuContent?.component ? (
                      showMenuContent?.component
                    ) : (
                      <iframe
                        src={showMenuContent?.link}
                        title="Trading iframe"
                        frameBorder="0"
                        height="100%"
                        width="100%"
                      />
                    )}
                  </div>
                </SideMenuContent>
              )}
              {/* {!showOtherPlatform?.show && <Sidebar />} */}
              {!showOtherPlatform?.show && <SidebarNew />}
              {!showOtherPlatform?.show && (
                <Content
                  showSideMenu={showSideMenu}
                  collapsedSideMenu={collapsedSideMenu}
                >
                  {sidebarState === SidebarState.markets && <AssetsPanel />}
                  {sidebarState === SidebarState.challengeDashboard ? (
                    activeWallet.isMargin ? (
                      <ChallengeDashboard />
                    ) : (
                      <ChallengeDashboardNonMargin />
                    )
                  ) : null}
                  <TradeGrid isLoggedIn={isLoggedIn} showHeader={showHeader}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {container !== ContainerState.dashboard && (
                        <InstrumentsBar isInAssets={false} />
                      )}
                      <ChartContainer isMobile={false} />
                      {isLoggedIn ? (
                        activeWallet.isMargin ? (
                          <TradePanel />
                        ) : (
                          <TradePanelNonMargin />
                        )
                      ) : null}
                    </div>
                    {activeWallet.isMargin ? (
                      <TradeBoxFX />
                    ) : tradingPanelType === 1 ? (
                      <TradeBoxNonMargin isMobile={false} />
                    ) : (
                      <TradeBoxFX />
                    )}
                  </TradeGrid>

                  {container === ContainerState.dashboard && (
                    <DashboardPanel onClose={onClose} />
                  )}
                </Content>
              )}
            </DesktopGrid>
            <Modal />
            <AlertsBar />
          </div>
        </div>
      </div>
    </Background>
  )
}

const mapStateToProps = (state: any) => ({
  container: state.container.content,
  partnerConfig: state.registry.data.partnerConfig,
  activeWallet: state.wallets.activeWallet,
  sidebarState: state.sidebar.panel,
  showSideMenu: state.container.showSideMenu,
  collapsedSideMenu: state.container.collapsedSideMenu,
  showChallenge: state.container.showChallenge,
})

export default connect(mapStateToProps, {
  actionSetContainer,
  actionSetSidebar,
  actionShowModal,
  actionCloseModal,
})(DesktopApp)
