import React from 'react'
import { connect } from 'react-redux'
import './index.scss'
import styled from 'styled-components'
import { t } from 'ttag'
import { Colors } from '../../../models/color'
import { formatCurrency } from '../../selectors/currency'
import { sumBy } from 'lodash'
import { TradeDirection } from '../../../models/instrument'

const MarginUsedPercent = styled.div<any>`
  margin-bottom: 14px;

  .used-margin-bar {
    height: 6px;
    background-color: #263346;
    border-radius: 3px;
    margin-bottom: 6px;
    position: relative;
    overflow: hidden;

    .used-margin-bar-percent {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      border-radius: 3px;
      width: ${(props) => (props.percent > 100 ? 100 : props.percent)}%;
      background-color: ${(props) =>
        props.percent < 100
          ? props.colors.accentDefault
          : props.colors.tradebox.lowActive};
    }
  }

  .used-margin-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .used-margin-text,
    .used-margin-percent {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: ${(props) => props.colors.secondaryText};
    }

    .used-margin-percent {
      color: ${(props) =>
        props.percent < 100
          ? props.colors.accentDefault
          : props.colors.tradebox.lowActive};
    }
  }
`

interface ITradeBoxMarginUsedPercentProps {
  colors: any
  openStakePerInstrument: any
  equity: number
  stake: number
  formatCurrency: (input: number) => string
  selectedDirection: TradeDirection
  instrument: number
}

const TradeBoxMarginUsedPercent = (props: ITradeBoxMarginUsedPercentProps) => {
  const {
    openStakePerInstrument,
    equity,
    formatCurrency,
    selectedDirection,
    stake,
    instrument,
  } = props

  const marginUsed =
    sumBy(openStakePerInstrument, (item: any) => {
      const { instrumentID, buy, sell } = item
      if (Number(instrument) === Number(instrumentID)) {
        if (selectedDirection === TradeDirection.up) {
          return buy + stake > sell ? buy + stake : sell
        } else {
          return sell + stake > buy ? sell + stake : buy
        }
      }
      return buy > sell ? buy : sell
    }) || 0

  const percent = ((marginUsed / equity) * 100).toFixed(2)

  return (
    <MarginUsedPercent colors={props.colors} percent={percent}>
      <div className="used-margin-bar">
        <div className="used-margin-bar-percent" />
      </div>
      <div className="used-margin-info">
        <span className="used-margin-text">{`${formatCurrency(
          marginUsed
        )} ${t`used margin`}`}</span>
        <span className="used-margin-percent">{`${percent}%`}</span>
      </div>
    </MarginUsedPercent>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  stake: state.trading.stake,
  openStakePerInstrument: state.wallets.openStakePerInstrument,
  equity: state.wallets.equity,
  formatCurrency: formatCurrency(state),
  selectedDirection: state.trading.selectedDirection,
  instrument: state.trading.selected,
})

export default connect(mapStateToProps, {})(TradeBoxMarginUsedPercent)
