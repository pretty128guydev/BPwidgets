/**
 * Implements a single item with expand/collapse
 * All interactions passed to parent
 *
 * showSellbackButton - calculated from get-registry, regulates whenever sellback button should be visible
 * allowSellback - fetched from position, regulates whenever it should be active or disabled
 */
import React, { useState } from 'react'
import { t } from 'ttag'
import { PositionItemPanel, ClosedPositionPanel } from './styled'
import { LocaleDate } from '../../../core/localeFormatDate'
import { ICurrency, IInstrument } from '../../../core/API'
import Images from '../../../assets/images'
import { TradeDirection } from '../../../models/instrument'
import { calculateDuration } from '../../TradePanel/TradePanel'
import { formatCurrencyFn } from '../../../core/currency'

const dateFormatter = (date: Date | number) => {
  try {
    return LocaleDate.format(date, 'dd-MMM-yyyy HH:mm')
  } catch (err) {
    return date
  }
}

interface IPositionItemProps {
  colors: any
  position: any
  currency?: ICurrency
  isMargin: boolean
  instrument: IInstrument
}

const ClosedPositionItem = ({
  colors,
  position,
  currency,
  isMargin,
  instrument,
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
    tradeID,
    pnl,
    reason,
    closeTime,
    expiryPrice,
  } = position

  return (
    <PositionItemPanel colors={colors}>
      <ClosedPositionPanel colors={colors}>
        <div className="left-panel">
          <div
            className="left-panel-item"
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
              className={
                direction === TradeDirection.up ? 'buy-row' : 'sell-row'
              }
            >
              <div className="high-color" style={{ fontWeight: 600 }}>
                <span className="icon-arrow-down">▾</span>
                {direction === TradeDirection.up ? t`Buy` : t`Sell`}
              </div>
              <div className={pnl >= 0 ? 'up-color' : 'down-color'}>
                {currency?.currencySymbol || '$'}
                {parseFloat(pnl.toFixed(2))}
              </div>
            </div>
          </div>
          <div
            className="left-panel-item"
            style={{ marginTop: 10 }}
            onClick={() => setExpanded(!expanded)}
          >
            <div>{t`Closed Time`}</div>
            <div>{dateFormatter(closeTime)}</div>
          </div>
          {expanded && (
            <div>
              <div className="left-panel-item">
                <div>{t`Open Time`}</div>
                <div>{dateFormatter(tradeTime)}</div>
              </div>
              <div className="left-panel-item">
                <div>{t`Trade ID`}</div>
                <div>{tradeID}</div>
              </div>
              {isMargin && (
                <div className="left-panel-item">
                  <div>{t`Units`}</div>
                  <div>
                    {formatCurrencyFn(
                      units,
                      {
                        currencySymbol: '',
                        precision: 2,
                      },
                      false
                    )}
                  </div>
                </div>
              )}
              <div className="left-panel-item">
                <div>{t`Amount`}</div>
                <div>
                  {formatCurrencyFn(stake, {
                    currencySymbol: currency?.currencySymbol || '$',
                    precision: 2,
                  })}
                </div>
              </div>
              <div className="left-panel-item">
                <div>{t`Open Price`}</div>
                <div>
                  {formatCurrencyFn(
                    referencePrice,
                    {
                      currencySymbol: '',
                      precision: instrument.precision,
                    },
                    false
                  )}
                </div>
              </div>
              <div className="left-panel-item">
                <div>{t`Closed Price`}</div>
                <div>
                  {formatCurrencyFn(
                    expiryPrice,
                    {
                      currencySymbol: '',
                      precision: instrument.precision,
                    },
                    false
                  )}
                </div>
              </div>
              <div className="left-panel-item">
                <div>{t`P&L`}</div>
                <div className={pnl >= 0 ? 'up-color' : 'down-color'}>
                  {currency?.currencySymbol || '$'}
                  {parseFloat(pnl.toFixed(2))}{' '}
                  {`(${pnl > 0 ? '+' : ''}${Math.round((pnl / stake) * 100)}%)`}
                </div>
              </div>
              <div className="left-panel-item">
                <div>{t`Close Reason`}</div>
                <div>{reason}</div>
              </div>
              <div className="left-panel-item">
                <div>{t`Swap`}</div>
                <div></div>
              </div>
            </div>
          )}
        </div>
        <div className="right-panel">
          <span>
            {expanded ? (
              <Images.ArrowUp width={18} height={18} stroke="#ffffff" />
            ) : (
              <Images.ArrowDown width={18} height={18} stroke="#ffffff" />
            )}
          </span>
        </div>
      </ClosedPositionPanel>
    </PositionItemPanel>
  )
}

export default ClosedPositionItem
