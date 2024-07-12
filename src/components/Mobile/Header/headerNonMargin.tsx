/**
 * Implements a mobile header
 * This header consist of three panels:
 * 1) Hamburger icon, logo, user panel
 * 2) Practice vs Real switcher
 * 3) Wallet balances, position button
 */
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { IRegistry, IWalletDetails } from '../../../core/API'
import Knob from './Knob'
import AccountPanel from '../AccountPanel'
import { actionPracticeMode } from '../../../actions/account'
import { formatCurrency } from '../../selectors/currency'
import { isLoggedIn } from '../../selectors/loggedIn'
import {
  TopPanel,
  Hamburger,
  CompanyLogo,
  KnobCaption,
  BalancePanel,
  Switcher,
  BalanceBlock,
  InvestedBlock,
  HomeButton,
} from './styled'
import { ReactComponent as HomeIcon } from './home.svg'
import { ReactComponent as CloseIcon } from './icon-close.svg'
import { ReactComponent as MenuIcon } from './menu.svg'
import styled from 'styled-components'
import { OpenAccountButton } from '../../Header/styled'
import { actionShowModal, ModalTypes } from '../../../actions/modal'
import { filter, isArray, sumBy } from 'lodash'
import { IOpenTrade } from '../../../core/interfaces/trades'
import WalletSelector from './WalletSellector/WalletSelector'
import { actionSetEquity, actionSetOpenPnL } from '../../../actions/wallets'
import { openPnlCal } from '../../../core/utils'
import { QuotesMap } from '../../../reducers/quotes'

enum MobileDrawers {
  none,
  menu,
  dashboard,
  positions,
  homeMenu,
}

interface IHeaderNonMarginProps {
  showHeader: boolean
  hidePracticeButton: boolean
  allowPracticeModeChange: boolean
  practiceMode: boolean
  loggedIn: boolean
  data: IRegistry
  colors: any
  activePanel: number
  onMenuClick: () => void
  onUserMenuClick: () => void
  onHomeButtonClick: () => void
  onSearchAssetsButtonClick: () => void
  formatCurrency: (value: any) => string
  actionPracticeMode: (mode: boolean) => void
  isMobile: boolean
  actionShowModal: any
  activeWallet: IWalletDetails
  openTrades: IOpenTrade[]
  actionSetEquity: (value: number) => void
  actionSetOpenPnL: (value: number) => void
  quotes: QuotesMap
}

const IconContainer = styled.div<{ colors: any; isHomeMenuOpen: boolean }>`
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isHomeMenuOpen ? props.colors.accentDefault : 'transparent'};
  color: ${(props) =>
    props.isHomeMenuOpen
      ? props.colors.backgroundHue1
      : props.colors.primaryText};
`

const MenuIconContainer = styled.div<{ colors: any }>`
  display: flex;
  width: 45px;
  height: 45px;
  justify-content: center;
  align-items: center;
  border-right: 2px solid ${(props) => props.colors.backgroundHue3};

  .stroke-color {
    stroke: ${(props) => props.colors.accentHue1};
  }

  .fill-color {
    fill: ${(props) => props.colors.accentHue1};
  }
`

const HeaderNonMargin = (props: IHeaderNonMarginProps) => {
  const {
    showHeader,
    hidePracticeButton,
    allowPracticeModeChange,
    loggedIn,
    practiceMode,
    colors,
    formatCurrency,
    activePanel,
    isMobile,
    onSearchAssetsButtonClick,
    actionShowModal,
    activeWallet,
    openTrades,
    actionSetEquity,
    actionSetOpenPnL,
    quotes,
  } = props
  const { partnerConfig } = props.data
  const showKnob = isMobile
    ? false
    : allowPracticeModeChange && !hidePracticeButton

  const { availableCash, reserved } = activeWallet

  const tradesPerWallet = filter(openTrades, {
    walletID: activeWallet.walletID,
  })
  const openPnL =
    sumBy(tradesPerWallet, (item) =>
      openPnlCal(item, quotes[item.instrumentID])
    ) || 0

  // Apply the same value as we do in mobile header
  const equity = openPnL + reserved + availableCash

  useEffect(() => {
    actionSetEquity(equity)
  }, [actionSetEquity, equity])

  useEffect(() => {
    actionSetOpenPnL(openPnL)
  }, [actionSetOpenPnL, openPnL])

  const { openAccountButton } = partnerConfig

  const openAccountBtn = isArray(openAccountButton)
    ? openAccountButton[0]
    : openAccountButton

  const onOpenAccountModal = () => actionShowModal(ModalTypes.OPEN_ACCOUNT)

  return (
    <>
      {showHeader && (
        <TopPanel colors={colors} isMobile={isMobile}>
          <Hamburger onClick={props.onMenuClick} />
          <CompanyLogo isMobile={isMobile}>
            {loggedIn && <WalletSelector />}
          </CompanyLogo>
          <AccountPanel onMenuClick={props.onUserMenuClick} />
        </TopPanel>
      )}

      <BalancePanel colors={colors}>
        <MenuIconContainer colors={colors} onClick={onSearchAssetsButtonClick}>
          <MenuIcon />
        </MenuIconContainer>
        {loggedIn ? (
          <>
            {showKnob && (
              <Switcher>
                <div className="knobContainer">
                  <Knob
                    backgroundColor={colors.accentDefault}
                    pinColor="#FFFFFF"
                    knobOnLeft={practiceMode}
                    onChange={() => props.actionPracticeMode(!practiceMode)}
                  />
                </div>
                <KnobCaption
                  active={practiceMode}
                  colors={colors}
                >{t`Practice`}</KnobCaption>
                <KnobCaption
                  active={!practiceMode}
                  colors={colors}
                >{t`Real`}</KnobCaption>
              </Switcher>
            )}
            <BalanceBlock>
              <span>{t`Balance`}</span>
              <div>{formatCurrency(availableCash)}</div>
            </BalanceBlock>
            <BalanceBlock>
              <span>{t`Open P&L`}</span>
              <div
                style={{
                  color:
                    openPnL < 0
                      ? colors.tradebox.lowText
                      : colors.tradebox.highText,
                }}
              >
                {formatCurrency(openPnL)}
              </div>
            </BalanceBlock>
            <InvestedBlock>
              <span>{t`Invested`}</span>
              <div>{formatCurrency(reserved)}</div>
            </InvestedBlock>
            <HomeButton onClick={props.onHomeButtonClick}>
              <IconContainer
                colors={colors}
                isHomeMenuOpen={
                  Number(activePanel) === Number(MobileDrawers.homeMenu)
                }
              >
                {Number(activePanel) === Number(MobileDrawers.homeMenu) ? (
                  <CloseIcon />
                ) : (
                  <HomeIcon />
                )}
              </IconContainer>
            </HomeButton>
          </>
        ) : (
          openAccountBtn?.show && (
            <OpenAccountButton
              colors={colors}
              isMobile={true}
              onClick={onOpenAccountModal}
            >
              {openAccountBtn?.label}
            </OpenAccountButton>
          )
        )}
      </BalancePanel>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  data: state.registry.data,
  allowPracticeModeChange: state.account.userInfo?.allowPracticeModeChange,
  practiceMode: state.account.userInfo?.practiceMode,
  hidePracticeButton: state.registry.data.partnerConfig.hidePracticeButton,
  loggedIn: isLoggedIn(state),
  activeWallet: state.wallets.activeWallet,
  formatCurrency: formatCurrency(state),
  colors: state.theme,
  isMobile: state.registry.isMobile,
  openTrades: state.trades.open,
  quotes: state.quotes,
})

export default connect(mapStateToProps, {
  actionPracticeMode,
  actionShowModal,
  actionSetEquity,
  actionSetOpenPnL,
})(HeaderNonMargin)
