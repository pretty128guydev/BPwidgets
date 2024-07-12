// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Text, Button, Overlay } from 'react-md'
import { connect } from 'react-redux'
import Images from '../../assets/images'
import { api } from '../../core/createAPI'
import { IQuote, QuotesMap } from '../../reducers/quotes'
import { lastQuoteRiskForSelectedInstrument } from '../selectors/instruments'
import { TradeDirection } from '../../models/instrument'
import { IInstrument, IWalletDetails } from '../../core/API'
import { t } from 'ttag'
import {
  BottomPositionPanel,
  HeaderTrade,
  LineExpand,
  LineExpandIcon,
  LineExpandWraper,
  TradeTable,
} from './styled'
import { actionEditTrade } from '../../actions/trading'
import { IEditTrade } from '../../models/trade'
import { IOpenTrade } from '../../core/interfaces/trades'
import {
  actionShowNotification,
  NotificationTypes,
} from '../../actions/notifications'
import { actionRefreshTrades } from '../../actions/trades'
import { SidebarState } from '../../reducers/sidebar'
import {
  actionSetSidebar,
  actionSetBottomTab,
  actionSetOpenBottomTab,
} from '../../actions/sidebar'
import ModalEditStopLoss from './ModalEditStopLoss'
import ModalEditTakeProfit from './ModalEditTakeProfit'
import { LocaleDate } from '../../core/localeFormatDate'
import moment from 'moment'
import { AvailableCurrencies } from '../../models/registry'
import ModalConfirmClose from './ModalConfirmClose'
import { delay } from 'lodash'
import { openPnlCal } from '../../core/utils'
import ModalEditStopLossNonMargin from './ModalEditStopLossNonMargin'
import ModalEditTakeProfitNonMargin from './ModalEditTakeProfitNonMargin'
import styled from 'styled-components'
import { formatCurrencyFn } from '../../core/currency'

interface ITradePanelNonMarginProps {
  colors: any
  trades: any
  quote: IQuote | {}
  instruments: IInstrument[]
  actionEditTrade: (trade: IEditTrade) => void
  actionRefreshTrades: () => void
  actionShowNotification: (
    type: NotificationTypes,
    props: { message: string }
  ) => void
  actionSetSidebar: (state: SidebarState) => void
  actionSetBottomTab: (tab: string) => void
  actionSetOpenBottomTab: (isOpen: boolean) => void
  openBottomTab: boolean
  wallets: any
  currencies: AvailableCurrencies
  quotes: QuotesMap
  partnerConfig: any
  bottomTab: string
  sidebarState: any
  checkedLots: boolean
  commissionEnabled: boolean
}

const Counter = styled.div<{ colors: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  min-width: 18px;
  height: 18px;
  font-size: 11px;
  border: 1px solid ${(props) => props.colors.accentDefault};
  border-radius: 50%;
  color: ${(props) => props.colors.accentDefault};
  background-color: ${(props) => props.colors.backgroundHue1};
`
export const calculateDuration = (close: number, open: number) => {
  const closeTime = moment(close)
  const openTime = moment(open)
  const duration = moment.duration(closeTime.diff(openTime))
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`
}

const TradePanelNonMargin = (props: ITradePanelNonMarginProps) => {
  const [tradeStopLossEditing, setTradeStopLossEditing] = useState(undefined)
  const [tradeTakeProfitEditing, setTradeTakeProfitEditing] =
    useState(undefined)
  const [tradeClose, setTradeClose] = useState(undefined)
  const { tradingPanelType } = props.partnerConfig
  const [mouseDown, setMouseDown] = useState(false)
  const [mouseMove, setMouseMove] = useState(false)
  const [tbodyHeight, setTbodyHeight] = useState(90)
  const [showOverlay, setShowOverLay] = useState(false)

  const tbodyRef = useRef()

  const handleEditTradeStopLoss = (
    trade: IOpenTrade,
    stopLoss: number,
    stopLossPrice: number
  ) => {
    props.actionEditTrade({
      walletID: trade.walletID,
      platformID: trade.platformID,
      tradeID: trade.tradeID,
      appId: 'fxcfd-web',
      stopLoss,
      stopLossPrice,
    })
    setTradeStopLossEditing(undefined)
  }

  const handleEditTradeTakeProfit = (
    trade: IOpenTrade,
    takeProfit: number,
    takeProfitPrice: number
  ) => {
    props.actionEditTrade({
      walletID: trade.walletID,
      platformID: trade.platformID,
      tradeID: trade.tradeID,
      appId: 'fxcfd-web',
      takeProfit,
      takeProfitPrice,
    })
    setTradeTakeProfitEditing(undefined)
  }

  const onCloseTrade = (trade: IOpenTrade) => {
    const { tradeID, walletID } = trade
    return api
      .closeTrades([[tradeID, walletID]])
      .then((res) => {
        props.actionRefreshTrades()
        if (res?.data?.length === 0) {
          props.actionShowNotification(NotificationTypes.TRADE_CLOSE_ERROR, {
            message: res?.message,
          })
        }
        setTradeClose(undefined)
      })
      .catch(() => {
        props.actionShowNotification(NotificationTypes.TRADE_CLOSE_ERROR, {
          message: t`Close trade fail`,
        })
      })
  }

  const onCancelTrade = (trade: IOpenTrade) => {
    return api
      .cancelTrade(trade)
      .then((res) => {
        props.actionRefreshTrades()
        if (!res?.success) {
          props.actionShowNotification(NotificationTypes.TRADE_CLOSE_ERROR, {
            message: res?.message,
          })
        }
        setTradeClose(undefined)
      })
      .catch(() => {
        props.actionShowNotification(NotificationTypes.TRADE_CLOSE_ERROR, {
          message: t`Close trade fail`,
        })
      })
  }

  const dateFormatter = (date: Date | number) => {
    try {
      return LocaleDate.format(date, 'dd/MM/yyyy HH:mm')
    } catch (err) {
      return date
    }
  }

  const handleResize = useCallback((e: any) => {
    !mouseMove && setMouseMove(true)
    const tbody: any = tbodyRef.current
    if (!tbody) return

    const ratio = window.devicePixelRatio
    const movementY = e.movementY / ratio
    const { height } = tbody.getBoundingClientRect()
    const windowHeight = (window.innerHeight * 33) / 100 - 100
    const adjustHeight = height - movementY
    if (!(adjustHeight < 70 || adjustHeight > windowHeight)) {
      setTbodyHeight(adjustHeight)
    }
  }, [])

  useEffect(() => {
    if (mouseDown) {
      window.addEventListener('mousemove', handleResize)
    }

    return () => {
      window.removeEventListener('mousemove', handleResize)
    }
  }, [mouseDown, handleResize])

  useEffect(() => {
    const handleMouseUp = () => {
      setMouseDown(false)
      setShowOverLay(false)
      delay(() => setMouseMove(false), 200)
    }

    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = () => {
    setMouseDown(true)
    setShowOverLay(true)
  }

  return (
    <>
      <BottomPositionPanel colors={props.colors}>
        <LineExpandWraper
          colors={props.colors}
          onClick={() => {
            if (mouseMove) return
            // props.actionSetOpenBottomTab(!props.openBottomTab)
            props.actionSetSidebar(
              props.sidebarState === SidebarState.positions
                ? SidebarState.trade
                : SidebarState.positions
            )
          }}
          onMouseDown={handleMouseDown}
        >
          <LineExpand colors={props.colors} className="line-expanded">
            <LineExpandIcon
              // expanded={props.openBottomTab}
              expanded={props.sidebarState === SidebarState.positions}
              colors={props.colors}
            >
              <span className="icon-move">▾</span>
              <span className="icon-move">▾</span>
              <span style={{ lineHeight: '17px' }}>{t`Open Positions`}</span>
              {props.trades?.['open']?.length > 0 && (
                <div className="counter-container">
                  <Counter colors={props.colors}>
                    {props.trades['open'].length}
                  </Counter>
                </div>
              )}
            </LineExpandIcon>
          </LineExpand>
        </LineExpandWraper>
        {/* {props.openBottomTab && ( */}
        {props.sidebarState === SidebarState.positions && (
          <>
            <HeaderTrade colors={props.colors}>
              <Text className="title-panel">
                {props.bottomTab === 'open'
                  ? t`Open Positions`
                  : props.bottomTab === 'pending'
                  ? t`Limit Orders`
                  : t`Closed Positions`}
              </Text>

              <div className="group-button">
                <Button
                  onClick={() => props.actionSetBottomTab('open')}
                  className={props.bottomTab === 'open' ? 'active' : ''}
                >
                  {t`Open Positions`}
                </Button>
                <Button
                  onClick={() => props.actionSetBottomTab('pending')}
                  className={props.bottomTab === 'pending' ? 'active' : ''}
                >
                  {t`Limit Orders`}
                </Button>
                <Button
                  onClick={() => props.actionSetBottomTab('closed')}
                  className={props.bottomTab === 'closed' ? 'active' : ''}
                >
                  {t`Closed Positions`}
                </Button>
              </div>
            </HeaderTrade>
            <div
              ref={tbodyRef as any}
              className="table-wrap scrollable"
              style={{ height: tbodyHeight }}
            >
              <TradeTable colors={props.colors}>
                <thead>
                  <tr>
                    <th>
                      {props.bottomTab === 'open' ||
                      props.bottomTab === 'closed'
                        ? t`Open Time`
                        : t`Placed Date`}
                    </th>
                    {props.bottomTab === 'closed' && <th>{t`Trade ID`}</th>}
                    <th>{t`Direction`}</th>
                    <th>{t`Symbol`}</th>
                    <th>{t`Amount`}</th>
                    <th>
                      {props.bottomTab === 'pending'
                        ? t`Limit Price`
                        : t`Open Price`}
                    </th>
                    {props.bottomTab === 'closed' && <th>{t`Closed Price`}</th>}
                    {props.bottomTab === 'open' && props.commissionEnabled && (
                      <th>{t`Commission`}</th>
                    )}
                    {(props.bottomTab === 'open' ||
                      props.bottomTab === 'closed') && (
                      <th>
                        {props.bottomTab === 'open' ? t`Open P&L` : t`P&L`}
                      </th>
                    )}
                    {props.bottomTab !== 'closed' && <th>{t`Stop Loss`}</th>}
                    {props.bottomTab !== 'closed' && <th>{t`Take Profit`}</th>}
                    {props.bottomTab !== 'closed' && (
                      <th className="fit-content">
                        {props.bottomTab === 'open' ? t`Close` : t`Cancel`}
                      </th>
                    )}
                    {props.bottomTab === 'closed' && <th>{t`Close Reason`}</th>}
                    {props.bottomTab === 'closed' && <th>{t`Close Time`}</th>}
                    {props.bottomTab === 'closed' && <th>{t`Swap`}</th>}
                  </tr>
                </thead>
                <tbody>
                  {props.trades[props.bottomTab]?.map(
                    (item: any, index: any) => {
                      if (
                        !item.walletID ||
                        item.walletID !== props.wallets.activeWallet.walletID
                      )
                        return
                      const wallet = props.wallets.wallets.find(
                        (w: IWalletDetails) => w.walletID === item.walletID
                      )
                      const currency = props.currencies[wallet.baseCurrency]
                      const instrument = props.instruments[item.instrumentID]
                      if (!instrument) return
                      const quote = props.quotes[item.instrumentID]
                      const pnl =
                        props.bottomTab === 'open'
                          ? openPnlCal(item, quote)
                          : item.pnl
                      const pnlValue =
                        props.bottomTab === 'open'
                          ? pnl / item.stake
                          : item.pnl / item.stake
                      return (
                        <tr
                          key={index}
                          className={
                            item.direction === 1 ? 'buy-row' : 'sell-row'
                          }
                        >
                          <td style={{ fontWeight: 400 }}>
                            {dateFormatter(
                              props.bottomTab === 'pending'
                                ? item.orderTime
                                : item.tradeTime
                            )}
                          </td>
                          {props.bottomTab === 'closed' && (
                            <td>{item.tradeID}</td>
                          )}
                          <td>
                            <div
                              className="high-color"
                              style={{ fontWeight: 600 }}
                            >
                              <span className="icon-arrow-down">▾</span>
                              {item.direction === TradeDirection.up
                                ? t`Buy`
                                : t`Sell`}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>
                              {item.instrumentName}
                            </div>
                          </td>
                          <td>
                            {formatCurrencyFn(item.stake, {
                              currencySymbol: currency?.currencySymbol || '$',
                              precision: 2,
                            })}
                          </td>
                          <td>
                            {formatCurrencyFn(
                              props.bottomTab === 'pending'
                                ? item.orderPrice
                                : item.referencePrice,
                              {
                                currencySymbol: currency?.currencySymbol || '$',
                                precision: 2,
                              }
                            )}
                          </td>
                          {props.bottomTab === 'closed' && (
                            <td>
                              {formatCurrencyFn(item.expiryPrice, {
                                currencySymbol: currency?.currencySymbol || '$',
                                precision: 2,
                              })}
                            </td>
                          )}
                          {props.bottomTab === 'open' &&
                            props.commissionEnabled && (
                              <td>
                                {formatCurrencyFn(item.commission, {
                                  currencySymbol:
                                    currency?.currencySymbol || '$',
                                  precision: 2,
                                })}
                              </td>
                            )}
                          {(props.bottomTab === 'open' ||
                            props.bottomTab === 'closed') && (
                            <td
                              className={
                                pnlValue >= 0 ? 'up-color' : 'down-color'
                              }
                            >
                              {formatCurrencyFn(pnl, {
                                currencySymbol: currency?.currencySymbol || '$',
                                precision: 2,
                              })}{' '}
                              {`(${pnlValue > 0 ? '+' : ''}${Math.round(
                                pnlValue * 100
                              )}%)`}
                            </td>
                          )}
                          {props.bottomTab !== 'closed' && (
                            <td>
                              <div className="amount-group">
                                <span>{item.stopLossPrice}</span>
                                <div
                                  style={
                                    instrument.isOpen
                                      ? {}
                                      : { opacity: 0.3, cursor: 'not-allowed' }
                                  }
                                >
                                  <Images.EditNonOutLine
                                    fill={props.colors.secondaryText}
                                    width={16}
                                    height={16}
                                    onClick={() =>
                                      instrument.isOpen &&
                                      setTradeStopLossEditing(item)
                                    }
                                  />
                                </div>
                              </div>
                            </td>
                          )}
                          {props.bottomTab !== 'closed' && (
                            <td>
                              <div className="amount-group">
                                <span>{item.takeProfitPrice}</span>
                                <div
                                  style={
                                    instrument.isOpen
                                      ? {}
                                      : { opacity: 0.3, cursor: 'not-allowed' }
                                  }
                                >
                                  <Images.EditNonOutLine
                                    fill={'#ffffff'}
                                    width={16}
                                    height={16}
                                    onClick={() =>
                                      instrument.isOpen &&
                                      setTradeTakeProfitEditing(item)
                                    }
                                  />
                                </div>
                              </div>
                            </td>
                          )}
                          {props.bottomTab !== 'closed' && (
                            <td className="fit-content">
                              <Button
                                onClick={() =>
                                  instrument.isOpen && setTradeClose(item)
                                }
                                className="close-button"
                                style={{
                                  color: props.colors.secondaryText,
                                  borderColor: props.colors.accentDefault,
                                  backgroundColor: props.colors.accentDefault,
                                  cursor: instrument.isOpen
                                    ? 'pointer'
                                    : 'not-allowed',
                                  opacity: instrument.isOpen ? 1 : 0.3,
                                }}
                              >
                                {props.bottomTab === 'open'
                                  ? t`Close`
                                  : t`Cancel`}
                              </Button>
                            </td>
                          )}
                          {props.bottomTab === 'closed' && (
                            <td>{item.reason}</td>
                          )}
                          {props.bottomTab === 'closed' && (
                            <td>{dateFormatter(item.closeTime)}</td>
                          )}
                          {props.bottomTab === 'closed' && (
                            <td>
                              {currency?.currencySymbol || '$'} {item.swaps}
                            </td>
                          )}
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </TradeTable>
            </div>
          </>
        )}
        {tradeStopLossEditing && tradingPanelType !== 1 && (
          <ModalEditStopLoss
            actionCloseModal={() => setTradeStopLossEditing(undefined)}
            actionSubmit={handleEditTradeStopLoss}
            trading={tradeStopLossEditing}
          />
        )}
        {tradeTakeProfitEditing && tradingPanelType !== 1 && (
          <ModalEditTakeProfit
            actionCloseModal={() => setTradeTakeProfitEditing(undefined)}
            actionSubmit={handleEditTradeTakeProfit}
            trading={tradeTakeProfitEditing}
          />
        )}
        {tradeStopLossEditing && tradingPanelType === 1 && (
          <ModalEditStopLossNonMargin
            actionCloseModal={() => setTradeStopLossEditing(undefined)}
            actionSubmit={handleEditTradeStopLoss}
            trading={tradeStopLossEditing}
          />
        )}
        {tradeTakeProfitEditing && tradingPanelType === 1 && (
          <ModalEditTakeProfitNonMargin
            actionCloseModal={() => setTradeTakeProfitEditing(undefined)}
            actionSubmit={handleEditTradeTakeProfit}
            trading={tradeTakeProfitEditing}
          />
        )}
        {tradeClose && (
          <ModalConfirmClose
            actionCloseModal={() => setTradeClose(undefined)}
            actionSubmit={
              (tradeClose as any)?.orderTriggerPrice
                ? onCancelTrade
                : onCloseTrade
            }
            trading={tradeClose}
          />
        )}
      </BottomPositionPanel>
      <Overlay
        id="modal-overlay"
        visible={showOverlay}
        onRequestClose={() => {}}
        style={{
          zIndex: 1,
          backgroundColor: 'transparent',
          cursor: 'ns-resize',
        }}
      />
    </>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  quote: lastQuoteRiskForSelectedInstrument(state as never),
  trades: state.trades,
  instruments: state.instruments,
  openBottomTab: state.sidebar.openBottomTab,
  wallets: state.wallets,
  currencies: state.registry.data.availableCurrencies,
  quotes: state.quotes,
  partnerConfig: state.registry.data.partnerConfig,
  bottomTab: state.sidebar.bottomTab,
  sidebarState: state.sidebar.panel,
  checkedLots: state.trading.checkedLots,
  commissionEnabled: state.registry.data.commissionEnabled,
})

export default connect(mapStateToProps, {
  actionEditTrade,
  actionRefreshTrades,
  actionShowNotification,
  actionSetSidebar,
  actionSetBottomTab,
  actionSetOpenBottomTab,
})(TradePanelNonMargin)
