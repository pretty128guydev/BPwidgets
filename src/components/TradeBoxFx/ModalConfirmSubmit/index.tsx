import React from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  getInstrumentObject,
  lastQuoteRiskForSelectedInstrument,
} from '../../selectors/instruments'
import './index.scss'
import classNames from 'classnames'
import { actionSetTradingError } from '../../../actions/trading'
import { calculatePipValue, currencyToString } from '../../../shares/functions'
import { IInstrument, IWalletDetails } from '../../../core/API'
import { getWalletCurrencySymbol } from '../../selectors/currency'
import { Overlay } from 'react-md'
import styled from 'styled-components'
import { IChallengeDashboardData } from '../../Dashboard/interfaces'

const Modal = styled.div<any>`
  position: fixed;
  top: calc(50% - 160px);
  left: calc(50% - 145px);
  width: 290px;
  display: block;
  z-index: 41;
  background-color: ${(props) => props.colors.tradebox.widgetBackground};
  padding: 30px;
`

interface IModalConfirmSubmitProps {
  colors: any
  quote: any
  stake: number
  selectedDirection: number
  stopLoss: number
  stopLossCoe: number
  pendingOrder: number
  currentInstrument: IInstrument
  leverage: number
  profit: number
  profitCoe: number
  currencySymbol: string
  actionCloseModal: () => void
  actionSubmit: () => void
  activeWallet: IWalletDetails
  checkedStopLoss: boolean
  checkedProfit: boolean
  challengeDashboard: IChallengeDashboardData
}

const ModalConfirmSubmit = (props: IModalConfirmSubmitProps) => {
  const {
    stake,
    selectedDirection,
    stopLoss,
    stopLossCoe,
    leverage,
    profit,
    currencySymbol,
    currentInstrument,
    quote,
    activeWallet,
    checkedStopLoss,
    checkedProfit,
    challengeDashboard,
  } = props
  const { pip, precision, tradingConfig } = currentInstrument
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

  const pipValue = calculatePipValue({
    stake: stake || 0,
    lastQuote: quote?.last || 0,
    leverage: currentLeverage || 0,
    pip,
  })

  const openPrice =
    selectedDirection === 0
      ? ''
      : currencyToString(selectedDirection === 1 ? ask : bid, precision)

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
          value: pipValue,
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
          isTotal: false,
          isHide: !checkedProfit,
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
          value: stopLossCoe,
          isString: true,
          isHide: false,
        },
        {
          title: t`Pip value`,
          value: pipValue,
          isHide: false,
        },
        {
          title: t`Open Price`,
          value: openPrice,
          isString: true,
          isHide: false,
        },
        {
          title: t`Estd. Loss`,
          value: stopLoss,
          isHide: false,
        },
        {
          title: t`Estd. Profit`,
          value: profit,
          isTotal: false,
          isHide: false,
        },
      ]

  return (
    <>
      <Modal colors={props.colors}>
        <div className="header-modal">{t`Confirm trade?`}</div>
        <div className="trade-confirm-summary">
          {data.map((item) =>
            item.isHide ? (
              <></>
            ) : (
              <div
                className={classNames({
                  'is-total': item.isTotal,
                  'trade-confirm-summary-row': true,
                })}
                style={{
                  color: item.isTotal
                    ? props.colors.chart.tooltip.color
                    : props.colors.tradebox.oneClickTradeText,
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
                    {currencyToString(
                      item.value as number,
                      props.currentInstrument.precision,
                      { addCurrencySymbol: currencySymbol }
                    )}
                  </div>
                )}
                {item.isString && <div>{item.value}</div>}
              </div>
            )
          )}
        </div>
        <div className="button-group">
          <div
            style={{
              color: props.colors.accentDefault,
              borderColor: props.colors.accentDefault,
            }}
            className="button button-cancel"
            onClick={props.actionCloseModal}
          >
            <span style={{ textTransform: 'uppercase' }}>{t`Cancel`}</span>
          </div>
          <div
            style={{
              color: props.colors.tradebox.btnNormalText,
              borderColor: props.colors.accentDefault,
              backgroundColor: props.colors.accentDefault,
            }}
            className="button button-submit"
            onClick={props.actionSubmit}
          >
            <span style={{ textTransform: 'uppercase' }}>{t`Confirm`}</span>
          </div>
        </div>
      </Modal>
      <Overlay
        id="modal-overlay"
        visible={true}
        onRequestClose={() => {}}
        style={{ zIndex: 40 }}
      />
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
  pendingOrder: state.trading.pendingOrder,
  profit: state.trading.profit,
  currencySymbol: getWalletCurrencySymbol(state),
  quote: lastQuoteRiskForSelectedInstrument(state),
  stopLossCoe: state.trading.stopLossCoe,
  profitCoe: state.trading.profitCoe,
  activeWallet: state.wallets.activeWallet,
  checkedStopLoss: state.trading.checkedStopLoss,
  checkedProfit: state.trading.checkedProfit,
  challengeDashboard: state.wallets.challengeDashboard,
})

export default connect(mapStateToProps, {
  actionSetTradingError,
})(ModalConfirmSubmit)
