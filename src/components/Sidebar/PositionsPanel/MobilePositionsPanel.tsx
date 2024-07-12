/**
 * Implements a Sidebar component with Tabs
 * Handles interaction
 * Single position item located in PositionItem
 */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import { isNil } from 'lodash'
import Tabs from '../../ui/Tabs'
import { ITradesState } from '../../../reducers/trades'
import { SidebarCaption } from '..'
import { PositionsListPanel, ClosedPositionsScroller } from './styled'
import Placeholder from './Placeholder'
import ClosedPositionItem from './ClosedPositionItem'
import './animation.css'
import { IOpenTrade } from '../../../core/interfaces/trades'
import SidebarContentsPanel from './SidebarContentsPanel'
import OpenPositionItem from './OpenPositionItem'
import { AvailableCurrencies } from '../../../models/registry'
import { QuotesMap } from '../../../reducers/quotes'
import { openPnlCal } from '../../../core/utils'
import { IInstrument, IWalletDetails } from '../../../core/API'
import { getUserInfo } from '../../selectors/instruments'
import {
  NotificationTypes,
  actionShowNotification,
} from '../../../actions/notifications'
import { actionRefreshTrades } from '../../../actions/trades'
import PendingPositionItem from './PendingPositionItem'
import CloseBtnRound from '../CloseBtnRound'
import BackBtnRound from '../BackBtnRound'
import ModalEditTrade from './ModalEditTrade'
import ModalEditTradeNonMargin from './ModalEditTradeNonMargin'
import { actionEditTrade } from '../../../actions/trading'
import { IEditTrade } from '../../../models/trade'

interface IMobilePositionsPanel {
  activeWallet: IWalletDetails
  colors: any
  isMobile: boolean
  trades: ITradesState
  selectedTrade: any
  onClose: () => void
  onBack: () => void
  sidebarProps: any
  wallets: any
  currencies: AvailableCurrencies
  quotes: QuotesMap
  instruments: IInstrument[]
  userID: string
  actionRefreshTrades: () => void
  actionShowNotification: (
    type: NotificationTypes,
    props: { message: string }
  ) => void
  actionEditTrade: (trade: IEditTrade) => void
}

const MobilePositionsPanel = (props: IMobilePositionsPanel) => {
  const activeTab =
    props.sidebarProps?.tab ||
    Number(props.selectedTrade && !isNil(props.selectedTrade.closedPrice))

  const tabs = [t`OPEN POSITIONS`, t`LIMIT ORDERS`, t`CLOSED POSITIONS`]
  const [tab, setTab] = useState<number>(activeTab)

  const [tradeEditing, setTradeEditing] = useState<IOpenTrade | undefined>(
    undefined
  )
  const [tradeNonMarginEditing, setTradeNonMarginEditing] = useState<
    IOpenTrade | undefined
  >(undefined)

  useEffect(() => {
    setTab(activeTab)
  }, [activeTab, props.sidebarProps])

  const isOpenPositions = tab === 0
  const isClosedPositions = tab === 2
  const anyPositions = isOpenPositions
    ? props.trades.open.length
    : isClosedPositions
    ? props.trades.closed.length
    : props.trades.pending.length

  const renderPositions = (tabIndex: number) => {
    const onEditTrade = (position: IOpenTrade, isMargin: boolean) => {
      if (isMargin) setTradeEditing(position)
      else setTradeNonMarginEditing(position)
    }

    if (tabIndex === 0) {
      return props.trades.open.map((position: IOpenTrade, index: number) => {
        const wallet = props.wallets.find(
          (w: IWalletDetails) => w.walletID === position.walletID
        )
        const currency = props.currencies[wallet.baseCurrency]
        const instrument = props.instruments[position.instrumentID]
        if (!instrument) return <></>
        const quote = props.quotes[position.instrumentID]
        const pnl = openPnlCal(position, quote)

        return (
          <OpenPositionItem
            colors={props.colors}
            key={index}
            position={position}
            currency={currency}
            openPnL={pnl}
            instrument={instrument}
            isMargin={wallet.isMargin}
            actionRefreshTrades={props.actionRefreshTrades}
            actionShowNotification={props.actionShowNotification}
            onEditTrade={onEditTrade}
          />
        )
      })
    }

    if (tabIndex === 2)
      return props.trades.closed.map((position: any, index: number) => {
        const wallet = props.wallets.find(
          (w: IWalletDetails) => w.walletID === position.walletID
        )
        const currency = props.currencies[wallet.baseCurrency]
        const instrument = props.instruments[position.instrumentID]
        if (!instrument) return <></>

        return (
          <ClosedPositionItem
            colors={props.colors}
            key={index}
            position={position}
            currency={currency}
            isMargin={wallet.isMargin}
            instrument={instrument}
          />
        )
      })

    return props.trades.pending.map((position: IOpenTrade, index: number) => {
      const wallet = props.wallets.find(
        (w: IWalletDetails) => w.walletID === position.walletID
      )
      const currency = props.currencies[wallet.baseCurrency]
      const instrument = props.instruments[position.instrumentID]
      if (!instrument) return <></>

      return (
        <PendingPositionItem
          colors={props.colors}
          key={index}
          position={position}
          currency={currency}
          actionRefreshTrades={props.actionRefreshTrades}
          actionShowNotification={props.actionShowNotification}
          onEditTrade={onEditTrade}
          isMargin={wallet.isMargin}
          instrument={instrument}
        />
      )
    })
  }

  const handleEditTrade = (
    trade: IOpenTrade,
    stopLoss: number,
    stopLossPrice: number,
    takeProfit: number,
    takeProfitPrice: number,
    isMargin: boolean
  ) => {
    props.actionEditTrade({
      walletID: trade.walletID,
      platformID: trade.platformID,
      tradeID: trade.tradeID,
      appId: 'fxcfd-web',
      stopLoss,
      stopLossPrice,
      takeProfit,
      takeProfitPrice,
    })
    if (isMargin) setTradeEditing(undefined)
    else setTradeNonMarginEditing(undefined)
  }

  return (
    <>
      <SidebarContentsPanel
        colors={props.colors}
        isMobile={props.isMobile}
        adjustable={false}
      >
        <SidebarCaption
          colors={props.colors}
          noBorder={true}
        >{t`Positions`}</SidebarCaption>
        <BackBtnRound colors={props.colors} onClick={props.onBack} />
        <CloseBtnRound colors={props.colors} onClick={props.onClose} />
        <Tabs value={tab} tabs={tabs} onChange={setTab} />
        <ClosedPositionsScroller colors={props.colors} className="scrollable">
          <PositionsListPanel>
            {anyPositions === 0 ? (
              <Placeholder tab={tab} color={props.colors.primaryText} />
            ) : (
              renderPositions(tab)
            )}
          </PositionsListPanel>
        </ClosedPositionsScroller>
      </SidebarContentsPanel>
      {tradeEditing && (
        <ModalEditTrade
          actionCloseModal={() => setTradeEditing(undefined)}
          actionSubmit={handleEditTrade}
          trading={tradeEditing}
        />
      )}
      {tradeNonMarginEditing && (
        <ModalEditTradeNonMargin
          actionCloseModal={() => setTradeNonMarginEditing(undefined)}
          actionSubmit={handleEditTrade}
          trading={tradeNonMarginEditing}
        />
      )}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  userID: getUserInfo(state).userID,
  trades: state.trades,
  quotes: state.quotes,
  selectedTrade: state.trades.selected,
  sidebarProps: state.sidebar.props,
  wallets: state.wallets.wallets,
  currencies: state.registry.data.availableCurrencies,
  instruments: state.instruments,
  activeWallet: state.wallets.activeWallet,
})

export default connect(mapStateToProps, {
  actionRefreshTrades,
  actionShowNotification,
  actionEditTrade,
})(MobilePositionsPanel)
