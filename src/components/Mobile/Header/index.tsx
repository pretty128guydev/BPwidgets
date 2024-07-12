/**
 * Implements a mobile header
 * This header consist of three panels:
 * 1) Hamburger icon, logo, user panel
 * 2) Practice vs Real switcher
 * 3) Wallet balances, position button
 */
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { IInstrument, IRegistry, IWalletDetails } from '../../../core/API'
import AccountPanel from '../AccountPanel'
import { formatCurrency, getCurrencyPrecision } from '../../selectors/currency'
import { isLoggedIn } from '../../selectors/loggedIn'
import {
  TopPanel,
  Hamburger,
  CompanyLogo,
  BalancePanel,
  InvestedBlock,
} from './styled'
import {
  convertHexToRGBA,
  isMobileLandscape,
  openPnlCal,
} from '../../../core/utils'
import {
  actionSetOpenStakePerInstrument,
  actionSetEquity,
} from '../../../actions/wallets'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { QuotesMap } from '../../../reducers/quotes'
import { filter, groupBy, isArray, sumBy } from 'lodash'
import { calculateEquity } from '../../../shares/functions'
import { ReactComponent as HomeIcon } from './home.svg'
import { ReactComponent as CloseIcon } from './icon-close.svg'
import { ReactComponent as MenuIcon } from './menu.svg'
import { ReactComponent as ArrowIcon } from './arrow.svg'
import styled from 'styled-components'
import { OpenAccountButton } from '../../Header/styled'
import { actionShowModal, ModalTypes } from '../../../actions/modal'
import WalletSelector from './WalletSellector/WalletSelector'

enum MobileDrawers {
  none,
  menu,
  dashboard,
  positions,
  homeMenu,
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

  path {
    stroke: ${(props) => props.colors.accentHue1};
  }
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

const ArrowIconContainer = styled.div<{ colors: any }>`
  display: flex;
  width: 30px;
  height: 30px;
  margin: 6px;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 35px;
  background-image: linear-gradient(
    to right,
    ${(props) => convertHexToRGBA(props.colors.backgroundHue1, 0)},
    ${(props) => props.colors.backgroundHue1}
  );

  path,
  line {
    stroke: ${(props) => props.colors.accentHue1};
  }
`

interface IHeaderProps {
  showHeader: boolean
  loggedIn: boolean
  data: IRegistry
  colors: any
  activePanel: number
  onMenuClick: () => void
  onUserMenuClick: () => void
  isMobile: boolean
  bonusWallet: any
  formatCurrency: (input: number, space?: boolean) => string
  openTrades: IOpenTrade[]
  activeWallet: IWalletDetails
  instruments: IInstrument[]
  quotes: QuotesMap
  precision: number
  actionSetEquity: (value: number) => void
  actionSetOpenStakePerInstrument: (value: any) => void
  onHomeButtonClick: () => void
  onSearchAssetsButtonClick: () => void
  actionShowModal: any
}

const Header = (props: IHeaderProps) => {
  const {
    showHeader,
    loggedIn,
    colors,
    formatCurrency,
    isMobile,
    activeWallet,
    openTrades,
    instruments,
    quotes,
    actionSetEquity,
    actionSetOpenStakePerInstrument,
    activePanel,
    onHomeButtonClick,
    onSearchAssetsButtonClick,
    onUserMenuClick,
    onMenuClick,
    actionShowModal,
    data,
  } = props

  const cashRef: any = useRef(null)

  const [isEndScrollCash, setIsEndScrollCash] = useState<boolean>(false)

  const { partnerConfig } = data
  const { availableCash } = activeWallet

  const openTradesPerWallet = filter(openTrades, {
    walletID: activeWallet.walletID,
  })

  const openTradesPerInstrument = groupBy(openTradesPerWallet, 'instrumentID')

  const openStakePerInstrument = Object.keys(openTradesPerInstrument).map(
    (key) => {
      const sumBuy =
        sumBy(openTradesPerInstrument[key], (item) => {
          const { stake, direction, instrumentID } = item
          const instrument = instruments[instrumentID]
          if (!instrument) return 0
          return direction === 1 ? stake : 0
        }) || 0
      const sumSell =
        sumBy(openTradesPerInstrument[key], (item) => {
          const { stake, direction, instrumentID } = item
          const instrument = instruments[instrumentID]
          if (!instrument) return 0
          return direction === -1 ? stake : 0
        }) || 0

      return { instrumentID: key, buy: sumBuy, sell: sumSell }
    }
  )

  const openStake =
    sumBy(openStakePerInstrument, (item) => {
      const { buy, sell } = item
      return buy > sell ? buy : sell
    }) || 0

  const openPnL =
    sumBy(openTradesPerWallet, (item) => {
      const instrument = instruments[item.instrumentID]
      if (!instrument) return 0
      const quote = quotes[item.instrumentID]
      return openPnlCal(item, quote)
    }) || 0

  const marginUsed = openStake
  const equity = calculateEquity(activeWallet, openPnL)

  useEffect(() => {
    actionSetOpenStakePerInstrument(openStakePerInstrument)
  }, [actionSetOpenStakePerInstrument, openStakePerInstrument])

  useEffect(() => {
    actionSetEquity(equity)
  }, [actionSetEquity, equity])

  const onScrollCashDiv = () => {
    if (cashRef.current)
      if (isEndScrollCash) {
        cashRef.current.scrollLeft -= 1000
      } else {
        cashRef.current.scrollLeft += 1000
      }
    setIsEndScrollCash(!isEndScrollCash)
  }

  const { openAccountButton } = partnerConfig

  const openAccountBtn = isArray(openAccountButton)
    ? openAccountButton[0]
    : openAccountButton

  const onOpenAccountModal = () => actionShowModal(ModalTypes.OPEN_ACCOUNT)

  return (
    <>
      {showHeader && (
        <TopPanel colors={colors} isMobile={isMobile}>
          <Hamburger onClick={onMenuClick} />
          <CompanyLogo isMobile={isMobile}>
            {loggedIn && <WalletSelector />}
          </CompanyLogo>
          <AccountPanel onMenuClick={onUserMenuClick} />
        </TopPanel>
      )}
      <BalancePanel colors={colors}>
        <MenuIconContainer colors={colors} onClick={onSearchAssetsButtonClick}>
          <MenuIcon />
        </MenuIconContainer>
        {loggedIn ? (
          <>
            <div ref={cashRef} className="currency-container">
              <InvestedBlock color={colors.accentHue1}>
                <span>{t`Balance`.toUpperCase()}</span>
                <div>{formatCurrency(availableCash, false)}</div>
              </InvestedBlock>
              <InvestedBlock color={colors.accentHue1}>
                <span>{t`Equity`.toUpperCase()}</span>
                <div>{formatCurrency(equity, false)}</div>
              </InvestedBlock>
              <InvestedBlock>
                <span>{t`Margin Used`.toUpperCase()}</span>
                <div>{formatCurrency(marginUsed, false)}</div>
              </InvestedBlock>
              <InvestedBlock color={colors.accentHue1}>
                <span>{t`Free Margin`.toUpperCase()}</span>
                <div>{formatCurrency(equity - marginUsed, false)}</div>
              </InvestedBlock>
              <InvestedBlock
                color={openPnL < 0 ? colors.primaryHue1 : colors.primaryDefault}
                style={{ marginRight: 30 }}
              >
                <span>{t`Open P&L`.toUpperCase()}</span>
                <div>{formatCurrency(openPnL, false)}</div>
              </InvestedBlock>
            </div>
            <ArrowIconContainer colors={colors} onClick={onScrollCashDiv}>
              <ArrowIcon />
            </ArrowIconContainer>
            <IconContainer
              onClick={onHomeButtonClick}
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
  loggedIn: isLoggedIn(state),
  formatCurrency: formatCurrency(state),
  colors: state.theme,
  isMobile: state.registry.isMobile,
  bonusWallet: state.trading.bonusWallet,
  openTrades: state.trades.open,
  activeWallet: state.wallets.activeWallet,
  instruments: state.instruments,
  quotes: state.quotes,
  precision: getCurrencyPrecision(state),
})

export default connect(mapStateToProps, {
  actionSetOpenStakePerInstrument,
  actionSetEquity,
  actionShowModal,
})(Header)
