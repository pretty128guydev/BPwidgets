import React, { useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
  lastQuotesRiskForConversionChainProfitInstruments,
} from '../../selectors/instruments'
import './index.scss'
import classNames from 'classnames'
import { actionSetTradingError } from '../../../actions/trading'
import { calculatePipValue, currencyToString } from '../../../shares/functions'
import { IQuote } from '../../../reducers/quotes'
import {
  IConversionChain,
  IInstrument,
  IWalletDetails,
} from '../../../core/API'
import { getWalletCurrencySymbol } from '../../selectors/currency'
import Images from '../../../assets/images'
import { IChallengeDashboardData } from '../../Dashboard/interfaces'

interface ITradeBoxSummaryProps {
  colors: any
  quote: IQuote
  stake: number
  selectedDirection: number
  stopLoss: number
  stopLossCoe: number
  leverage: number
  pendingOrder: number
  currentInstrument: IInstrument
  profit: number
  lotValue: number
  currencySymbol: string
  isMobile?: boolean
  partnerConfig: any
  conversionChainProfit: IConversionChain
  quotesProfit: any[]
  activeWallet: IWalletDetails
  checkedStopLoss: boolean
  checkedProfit: boolean
  commissionEnabled: boolean
  challengeDashboard: IChallengeDashboardData
}

const TradeBoxSummary = (props: ITradeBoxSummaryProps) => {
  const [expanded, setExpanded] = useState(!props.isMobile)

  const {
    stake,
    selectedDirection,
    stopLoss,
    stopLossCoe,
    leverage,
    profit,
    lotValue,
    currencySymbol,
    currentInstrument,
    quote,
    partnerConfig,
    conversionChainProfit,
    quotesProfit,
    activeWallet,
    checkedStopLoss,
    checkedProfit,
    commissionEnabled,
    challengeDashboard,
  } = props
  const {
    pip,
    precision,
    closedTradeCommissionCoefficient,
    openTradeCommissionCoefficient,
    tradingConfig,
  } = currentInstrument
  const { bid, ask } = props.quote

  let currentLeverage = leverage

  if (activeWallet.challengeID) {
    const { state } = challengeDashboard
    if (
      state.leverageCap &&
      Number(state.leverageCap) < tradingConfig.defaultLeverage
    ) {
      currentLeverage = Number(state.leverageCap)
    }
  }

  const openPrice =
    selectedDirection === 0
      ? ''
      : currencyToString(selectedDirection === 1 ? ask : bid, precision)

  const pipValue = () => {
    let pipValue = 0
    if (partnerConfig.tradingPanelType === 1) {
      pipValue = calculatePipValue({
        stake: stake || 0,
        lastQuote: quote?.last || 0,
        leverage: leverage || 0,
        pip,
      })
    } else {
      pipValue = lotValue * pip
    }

    const { operations } = conversionChainProfit
    operations.forEach((o) => {
      const { instrumentID, action } = o
      const quo = quotesProfit.find((q) => q.instrumentID === instrumentID)
      if (quo)
        pipValue = action === '*' ? pipValue * quo.last : pipValue / quo.last
    })

    return pipValue
  }

  const data = activeWallet.isMargin
    ? [
        {
          title: t`Leverage`,
          value: '1:' + currentLeverage,
          isString: true,
          isHide: false,
        },
        {
          title: t`Pip value`,
          value: pipValue(),
          isHide: false,
        },
        {
          title: t`Open Price`,
          value: openPrice,
          isString: true,
          isHide: false,
        },
        {
          title: t`Loss`,
          value: stopLoss,
          isHide: !checkedStopLoss,
        },
        {
          title: t`Profit`,
          value: profit,
          isHide: !checkedProfit,
          isTotal: false,
        },
      ]
    : [
        {
          title: t`Leverage`,
          value: '1:' + currentLeverage,
          isString: true,
          isHide: false,
        },
        {
          title: t`Liquidation Price`,
          value: parseFloat(Number(stopLossCoe).toFixed(5)),
          isString: true,
          isHide: false,
        },
        {
          title: t`Pip value`,
          value: pipValue(),
          isHide: false,
        },
        {
          title: t`Open Price`,
          value: openPrice,
          isString: true,
          isHide: false,
        },
        {
          title: t`Stop Loss`,
          value: stopLoss,
          isHide: false,
        },
        {
          title: t`Take Profit`,
          value: profit,
          isTotal: false,
          isHide: false,
        },
      ]

  if (commissionEnabled)
    data.push({
      title: t`Commission`,
      value: currencyToString(
        parseFloat(
          (
            (Number(openTradeCommissionCoefficient) +
              Number(closedTradeCommissionCoefficient)) *
            stake
          ).toFixed(2)
        ),
        2,
        {
          addCurrencySymbol: currencySymbol,
        }
      ),
      isHide: false,
      isString: true,
    })

  return (
    <>
      <div
        className="order-summary-header"
        style={{ marginTop: props.isMobile ? 24 : 14 }}
        onClick={() => setExpanded(!expanded)}
      >
        <span
          className="order-summary-title"
          //   style={{
          //     color: `rgb(${props.colors.accentPalette.hues['hue-1']},${props.colors.accentPalette.hues['hue-1']},${props.colors.accentPalette.hues['hue-1']})`,
          //   }}
          style={{ color: 'rgb(800,800,800)' }}
        >{t`Order summary`}</span>
        <span
          className="arrow-order"
          style={{
            color: `#${
              props.colors.accentPalette.colors[
                props.colors.accentPalette.hues['hue-1']
              ]
            }`,
          }}
        >
          {expanded ? (
            <Images.ArrowUp
              width={18}
              height={18}
              stroke={`#${
                props.colors.accentPalette.colors[
                  props.colors.accentPalette.hues['hue-1']
                ]
              }`}
            />
          ) : (
            <Images.ArrowDown
              width={18}
              height={18}
              stroke={`#${
                props.colors.accentPalette.colors[
                  props.colors.accentPalette.hues['hue-1']
                ]
              }`}
            />
          )}
        </span>
      </div>
      {expanded && (
        <div className="trade-box-summary">
          {data.map((item) =>
            item.isHide ? (
              <></>
            ) : (
              <div
                key={item.title}
                className={classNames({
                  'is-total': item.isTotal,
                  'trade-box-summary-row': true,
                })}
                style={{
                  color: props.colors.defaultText,
                  fontWeight: 'bold',
                  fontSize: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  lineHeight: '18px',
                  marginBottom: 8,
                  paddingTop: item.isTotal ? 8 : 0,
                  borderTop: item.isTotal ? '1px solid' : 'unset',
                  borderTopColor: props.colors.tradebox.oneClickTradeText,
                }}
              >
                <div className="title">{item.title}</div>
                {!item.isString && (
                  <div>
                    {currencyToString(item.value as number, precision, {
                      addCurrencySymbol: currencySymbol,
                    })}
                  </div>
                )}
                {item.isString && <div>{item.value}</div>}
              </div>
            )
          )}
        </div>
      )}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  currentInstrument: getInstrumentObject(state),
  leverage: state.trading.currentLeverage,
  colors: state.theme,
  selectedDirection: state.trading.selectedDirection,
  stake: state.trading.stake,
  stopLoss: state.trading.stopLoss,
  checkedStopLoss: state.trading.checkedStopLoss,
  stopLossCoe: state.trading.stopLossCoe,
  pendingOrder: state.trading.pendingOrder,
  quote: lastQuoteRiskForSelectedInstrument(state as never) as IQuote,
  profit: state.trading.profit,
  checkedProfit: state.trading.checkedProfit,
  lotValue: state.trading.lotValue,
  currencySymbol: getWalletCurrencySymbol(state),
  partnerConfig: state.registry.data.partnerConfig,
  commissionEnabled: state.registry.data.commissionEnabled,
  quotesProfit: lastQuotesRiskForConversionChainProfitInstruments(state),
  conversionChainProfit: state.trading.conversionChainProfit,
  activeWallet: state.wallets.activeWallet,
  challengeDashboard: state.wallets.challengeDashboard,
})

export default connect(mapStateToProps, {
  actionSetTradingError,
})(TradeBoxSummary)
