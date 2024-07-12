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
import CloseButton from '../CloseBtn'
import { IOpenTrade } from '../../../core/interfaces/trades'
import SidebarContentsPanel from '../SidebarContentsPanel'
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

interface IPositionsPanel {
  colors: any
  isMobile: boolean
  trades: ITradesState
  selectedTrade: any
  onClose: () => void
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
}

const PositionsPanel = (props: IPositionsPanel) => {
  const activeTab =
    props.sidebarProps?.tab ||
    Number(props.selectedTrade && !isNil(props.selectedTrade.closedPrice))

  const tabs = [t`OPEN POSITIONS`, t`CLOSED POSITIONS`]
  const [tab, setTab] = useState<number>(activeTab)

  useEffect(() => {
    setTab(activeTab)
  }, [activeTab, props.sidebarProps])

  const isOpenPositions = tab === 0
  const anyPositions = isOpenPositions
    ? props.trades.open.length
    : props.trades.closed.length

  const renderPositions = (open: boolean) => {
    if (open) {
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
            actionRefreshTrades={props.actionRefreshTrades}
            actionShowNotification={props.actionShowNotification}
            instrument={instrument}
            isMargin={wallet.isMargin}
          />
        )
      })
    }
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
  }

  return (
    <SidebarContentsPanel
      colors={props.colors}
      isMobile={props.isMobile}
      adjustable={false}
    >
      <SidebarCaption colors={props.colors}>{t`Positions`}</SidebarCaption>
      <CloseButton colors={props.colors} onClick={props.onClose} />
      <Tabs value={tab} tabs={tabs} onChange={setTab} />
      <ClosedPositionsScroller colors={props.colors} className="scrollable">
        <PositionsListPanel>
          {anyPositions === 0 ? (
            <Placeholder
              open={isOpenPositions}
              color={props.colors.primaryText}
            />
          ) : (
            renderPositions(isOpenPositions)
          )}
        </PositionsListPanel>
      </ClosedPositionsScroller>
    </SidebarContentsPanel>
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
})

export default connect(mapStateToProps, {
  actionRefreshTrades,
  actionShowNotification,
})(PositionsPanel)
