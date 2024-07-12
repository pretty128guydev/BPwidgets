/**
 * Implements a single item with expand/collapse
 * All interactions passed to parent
 *
 * showSellbackButton - calculated from get-registry, regulates whenever sellback button should be visible
 * allowSellback - fetched from position, regulates whenever it should be active or disabled
 */
import React, { useState } from 'react'
import { t } from 'ttag'
import {
  PositionItemPanel,
  OpenPositionPanel,
  CloseButton,
  EditSLTPButton,
} from './styled'
import { IOpenTrade } from '../../../core/interfaces/trades'
import { LocaleDate } from '../../../core/localeFormatDate'
import { ICurrency, IInstrument } from '../../../core/API'
import Images from '../../../assets/images'
import { TradeDirection } from '../../../models/instrument'
import { api } from '../../../core/createAPI'
import { NotificationTypes } from '../../../actions/notifications'
import { formatCurrencyFn } from '../../../core/currency'
import { connect } from 'react-redux'

const dateFormatter = (date: Date | number) => {
  try {
    return LocaleDate.format(date, 'dd-MMM-yyyy HH:mm')
  } catch (err) {
    return date
  }
}

interface IPositionItemProps {
  colors: any
  position: IOpenTrade
  currency: ICurrency
  openPnL: number
  actionRefreshTrades?: () => void
  actionShowNotification?: (
    type: NotificationTypes,
    props: { message: string }
  ) => void
  updatable?: boolean
  onEditTrade?: (trade: IOpenTrade, isMargin: boolean) => void
  isMargin?: boolean
  instrument: IInstrument
  isMobile: boolean
}

const OpenPositionItem = ({
  colors,
  position,
  currency,
  openPnL,
  actionRefreshTrades,
  actionShowNotification,
  updatable = true,
  onEditTrade,
  isMargin,
  instrument,
  isMobile,
}: IPositionItemProps) => {
  const [expanded, setExpanded] = useState(false)

  const {
    instrumentID,
    instrumentName,
    direction,
    stake,
    units,
    tradeTime,
    referencePrice,
    stopLossPrice,
    stopLossAmount,
    takeProfitPrice,
    takeProfitAmount,
    tradeID,
    walletID,
  } = position

  const onCloseTrade = () => {
    return api
      .closeTrades([[tradeID, walletID]])
      .then((res) => {
        actionRefreshTrades?.()
        if ((res && !res.success) || !res) {
          actionShowNotification?.(NotificationTypes.TRADE_CLOSE_ERROR, {
            message: res?.message || 'Close trade fail',
          })
        }
      })
      .catch(() => {
        actionShowNotification?.(NotificationTypes.TRADE_CLOSE_ERROR, {
          message: t`Close trade fail`,
        })
      })
  }

  return (
    <PositionItemPanel colors={colors}>
      <OpenPositionPanel colors={colors}>
        <div
          className="position-panel-header"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="icon-instrument-name-wrapper">
            <img
              className="img-asset"
              src={`${process.env.PUBLIC_URL}/static/icons/instruments/${instrumentID}.svg`}
              alt={`Instrument ${instrumentID}`}
            />
            <span className="instrument-name">{instrumentName}</span>
          </div>
          <div
            className={`direction-row ${
              direction === TradeDirection.up ? 'up-color' : 'down-color'
            }`}
            style={{ fontWeight: 600 }}
          >
            <span className="icon-arrow-down">▾</span>
            {direction === TradeDirection.up ? t`Buy` : t`Sell`}
          </div>
          <div className={openPnL >= 0 ? 'up-color' : 'down-color'}>
            <span style={{ display: 'inline-block', marginRight: 10 }}>
              {currency?.currencySymbol || '$'}
              {parseFloat(openPnL.toFixed(2))}
            </span>
            {`${openPnL > 0 ? '+' : ''}${Math.round((openPnL / stake) * 100)}%`}
          </div>
          {expanded ? (
            <Images.ArrowUp width={18} height={18} stroke="#ffffff" />
          ) : (
            <Images.ArrowDown width={18} height={18} stroke="#ffffff" />
          )}
        </div>
        {expanded && (
          <>
            <div className="trade-detail">
              <div className="line">
                <div>{t`Open Time`}</div>
                <span>{dateFormatter(tradeTime)}</span>
              </div>
              {isMargin && (
                <div className="line">
                  <div>{t`Units`}</div>
                  <span>
                    {formatCurrencyFn(
                      units,
                      {
                        currencySymbol: '',
                        precision: 2,
                      },
                      false
                    )}
                  </span>
                </div>
              )}
              <div className="line">
                <div>{t`Amount`}</div>
                <span>
                  {formatCurrencyFn(stake, {
                    currencySymbol: currency?.currencySymbol || '$',
                    precision: 2,
                  })}
                </span>
              </div>
              <div className="line">
                <div>{t`Entry Price`}</div>
                <span>
                  {formatCurrencyFn(referencePrice, {
                    currencySymbol: '',
                    precision: instrument.precision,
                  })}
                </span>
              </div>
              <div className="line">
                <div>
                  {t`Stop Loss`} {t`Price`}
                </div>
                <span>
                  {formatCurrencyFn(stopLossPrice, {
                    currencySymbol: '',
                    precision: instrument.precision,
                  })}
                </span>
              </div>
              {!isMobile &&
                {
                  /* <div className="line">
                <div>{t`Stop Loss`}</div>
                <span>
                  {formatCurrencyFn(-stopLossAmount, {
                    currencySymbol: currency?.currencySymbol || '$',
                    precision: 2,
                  })}
                </span>
              </div> */
                }}
              <div className="line">
                <div>
                  {t`Take Profit`} {t`Price`}
                </div>
                <span>
                  {formatCurrencyFn(takeProfitPrice, {
                    currencySymbol: '',
                    precision: instrument.precision,
                  })}
                </span>
              </div>
              {!isMobile &&
                {
                  /* <div className="line">
                <div>{t`Take Profit`}</div>
                <span>
                  {formatCurrencyFn(takeProfitAmount, {
                    currencySymbol: currency?.currencySymbol || '$',
                    precision: 2,
                  })}
                </span>
              </div> */
                }}
              {updatable && (
                <div className="line">
                  <div>
                    <EditSLTPButton
                      colors={colors}
                      disabled={!instrument.isOpen}
                      onClick={() =>
                        instrument.isOpen &&
                        onEditTrade?.(position, isMargin || false)
                      }
                    >{t`Edit SL&TP`}</EditSLTPButton>
                    <CloseButton
                      colors={colors}
                      disabled={!instrument.isOpen}
                      onClick={onCloseTrade}
                    >{t`Close`}</CloseButton>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </OpenPositionPanel>
    </PositionItemPanel>
  )
}

const mapStateToProps = (state: any) => ({
  isMobile: state.registry.isMobile,
})

export default connect(mapStateToProps)(OpenPositionItem)
