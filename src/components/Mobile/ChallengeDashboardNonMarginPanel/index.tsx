/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { actionSetChallengeDashboard } from '../../../actions/wallets'
import { Panel, ChallengeDashboardItem } from './styled'
import { api } from '../../../core/createAPI'
import Header from './Header'
import { t } from 'ttag'
import Images from '../../../assets/images'
import { ReactComponent as CheckMark } from './icons/checkMark.svg'
import { IWalletDetails } from '../../../core/API'
import { IChallengeDashboardData } from '../../Dashboard/interfaces'
import { getWalletCurrencySymbol } from '../../selectors/currency'
import { LocaleDate } from '../../../core/localeFormatDate'
import { formatCurrencyFn } from '../../../core/currency'
import moment from 'moment'

interface IChallengeDashboardPanelProps {
  colors: any
  onClose: () => void
  activeWallet: IWalletDetails
  currencySymbol: string
  equity: number
  openPnL: number
  invested: number
  challengeDashboard: IChallengeDashboardData
  actionSetChallengeDashboard: (data: IChallengeDashboardData) => void
  trades: any
}

const fetchChallengeDashboard = async (challengeID: number): Promise<any> => {
  return await api.fetchChallengeDashboard(challengeID)
}

const ChallengeDashboardPanel = ({
  colors,
  onClose,
  activeWallet,
  currencySymbol,
  equity,
  openPnL,
  invested,
  challengeDashboard,
  actionSetChallengeDashboard,
  trades,
}: IChallengeDashboardPanelProps) => {
  const { state: challengeDashboardState } = challengeDashboard

  const [loading, setLoading] = useState<boolean>(false)

  const { open, closed } = trades

  const totalTradesToday = [...open, ...closed].filter(({ tradeTime }) =>
    moment(tradeTime).isSame(moment(), 'day')
  ).length

  const fetchData = async () => {
    if (!loading) {
      setLoading(true)

      if (activeWallet.challengeID) {
        const challengeData = await fetchChallengeDashboard(
          activeWallet.challengeID
        )
        const { success, challenge } = challengeData
        if (success) {
          actionSetChallengeDashboard(challenge)
        }
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeWallet])

  const getChallengeStatusText = (status: string) => {
    switch (status) {
      case '1':
        return t`Active`
      case '2':
        return t`On hold`
      case '3':
      case '4':
        return t`Ended`
      default:
        return ''
    }
  }

  const {
    title,
    currentTradingDays,
    initialBalance,
    startTime,
    leverageCap,
    status,
    maxDailyLossPct,
    maxTotalLossPct,
    profitGoalPct,
    maxDailyTrades,
    maxTradingDays,
    lastDayLoss,
    maxDailyTradesReached,
    maxTradingDaysReached,
  } = challengeDashboardState

  const { availableCash, availableBonus } = activeWallet

  const balance = availableCash + availableBonus - invested

  const drawdown = Number(equity) - Number(initialBalance)
  const drawdownPercent = (drawdown / Number(initialBalance)) * 100
  const dailyDrawdownPercent =
    (Math.abs(Number(lastDayLoss)) / Number(initialBalance)) * 100
  const balancePercent = parseFloat(
    (
      ((Number(balance) - Number(initialBalance)) / Number(initialBalance)) *
      100
    ).toFixed(2)
  )
  const equityPercent = parseFloat(
    (
      ((Number(equity) - Number(initialBalance)) / Number(initialBalance)) *
      100
    ).toFixed(2)
  )

  return (
    <Panel colors={colors} className="scrollable">
      <Header colors={colors} onClickClose={onClose} />
      <ChallengeDashboardItem colors={colors} padding={20}>
        <div className="evaluation-title">{title}</div>
        <div className="evaluation-container">
          <span className="evaluation-text">{t`Starting date`}</span>
          <span className="evaluation-value">
            {startTime && LocaleDate.format(new Date(startTime), 'dd/MM/u')}
          </span>
        </div>
        {leverageCap && (
          <div className="evaluation-container">
            <span className="evaluation-text">{t`Leverage up to`}</span>
            <span className="evaluation-value">
              1:{parseFloat(Number(leverageCap).toFixed())}
            </span>
          </div>
        )}
        <div className="evaluation-container">
          <span className="evaluation-text">{t`Initial balance`}</span>
          <span className="evaluation-value">
            {formatCurrencyFn(
              Number(initialBalance),
              {
                currencySymbol,
                precision: 2,
              },
              false
            )}
          </span>
        </div>
        <div className="evaluation-container">
          <span className="evaluation-text">{t`Challenge status`}</span>
          <span className="evaluation-value">
            {getChallengeStatusText(status)}
          </span>
        </div>
      </ChallengeDashboardItem>
      <ChallengeDashboardItem className="group" colors={colors} padding={0}>
        <div className="group-item">
          <div className="group-item-title">{t`Balance`}</div>
          <div className="group-item-value">
            {formatCurrencyFn(
              balance,
              {
                currencySymbol,
                precision: 2,
              },
              false
            )}
          </div>
          <div
            className={`group-item-change ${
              balancePercent <= 0 ? 'down' : 'up'
            }`}
          >
            <span>
              {balancePercent <= 0 ? (
                <Images.ArrowDownLeft
                  fill={colors.tradebox.lowActive}
                  width={10}
                  height={10}
                />
              ) : (
                <Images.ArrowUpRight
                  fill={colors.tradebox.highActive}
                  width={10}
                  height={10}
                />
              )}
            </span>
            <span>{balancePercent}%</span>
          </div>
        </div>
        <div className="group-item">
          <div className="group-item-title">{t`Equity`}</div>
          <div className="group-item-value">
            {formatCurrencyFn(
              equity,
              {
                currencySymbol,
                precision: 2,
              },
              false
            )}
          </div>
          <div
            className={`group-item-change ${
              equityPercent <= 0 ? 'down' : 'up'
            }`}
          >
            <span>
              {equityPercent <= 0 ? (
                <Images.ArrowDownLeft
                  fill={colors.tradebox.lowActive}
                  width={10}
                  height={10}
                />
              ) : (
                <Images.ArrowUpRight
                  fill={colors.tradebox.highActive}
                  width={10}
                  height={10}
                />
              )}
            </span>
            <span>{equityPercent}%</span>
          </div>
        </div>
      </ChallengeDashboardItem>
      <ChallengeDashboardItem className="group" colors={colors} padding={0}>
        <div className="group-item">
          <div className="group-item-title">{t`Total drawdown`}</div>
          <div className="group-item-value">
            {`${drawdown === 0 ? '' : '-'}${formatCurrencyFn(
              drawdown > 0 ? 0 : Math.abs(drawdown),
              {
                currencySymbol,
                precision: 2,
              },
              false
            )}`}
          </div>
          <div
            className={`group-item-change ${
              drawdownPercent <= 0 ? 'down' : 'up'
            }`}
          >
            <span>
              {drawdownPercent <= 0 ? (
                <Images.ArrowDownLeft
                  fill={colors.tradebox.lowActive}
                  width={10}
                  height={10}
                />
              ) : (
                <Images.ArrowUpRight
                  fill={colors.tradebox.highActive}
                  width={10}
                  height={10}
                />
              )}
            </span>
            <span>{parseFloat(drawdownPercent.toFixed(1))}%</span>
          </div>
        </div>
        <div className="group-item">
          <div className="group-item-title">{t`Drawdown limit`}</div>
          <div className="group-item-value">
            {`${Number(maxTotalLossPct) < 0 ? '-' : ''}${formatCurrencyFn(
              Math.abs(
                (Number(initialBalance) * Number(maxTotalLossPct)) / 100
              ),
              {
                currencySymbol,
                precision: 2,
              },
              false
            )}`}
          </div>
          <div className="group-item-change down">
            <span>
              <Images.ArrowDownLeft
                fill={colors.tradebox.lowActive}
                width={10}
                height={10}
              />
            </span>
            <span>
              {parseFloat(Math.abs(Number(maxTotalLossPct)).toFixed(1)) * -1}%
            </span>
          </div>
        </div>
      </ChallengeDashboardItem>
      <ChallengeDashboardItem className="group" colors={colors} padding={0}>
        <div className="group-item">
          <div className="group-item-title">{t`Max daily drawdown`}</div>
          <div className="group-item-value">
            {`${Number(lastDayLoss) === 0 ? '' : '-'}${formatCurrencyFn(
              Math.abs(Number(lastDayLoss)),
              {
                currencySymbol,
                precision: 2,
              },
              false
            )}`}
          </div>
          <div
            className={`group-item-change ${
              dailyDrawdownPercent !== 0 ? 'down' : 'up'
            }`}
          >
            <span>
              {dailyDrawdownPercent !== 0 ? (
                <Images.ArrowDownLeft
                  fill={colors.tradebox.lowActive}
                  width={10}
                  height={10}
                />
              ) : (
                <Images.ArrowUpRight
                  fill={colors.tradebox.highActive}
                  width={10}
                  height={10}
                />
              )}
            </span>
            <span>
              {`${dailyDrawdownPercent !== 0 ? '-' : ''}${parseFloat(
                dailyDrawdownPercent.toFixed(1)
              )}`}
              %
            </span>
          </div>
        </div>
        <div className="group-item">
          <div className="group-item-title">{t`Daily drawdown limit`}</div>
          <div className="group-item-value">
            {`${Number(maxDailyLossPct) < 0 ? '-' : ''}${formatCurrencyFn(
              Math.abs(
                (Number(initialBalance) * Number(maxDailyLossPct)) / 100
              ),
              {
                currencySymbol,
                precision: 2,
              },
              false
            )}`}
          </div>
          <div className="group-item-change down">
            <span>
              <Images.ArrowDownLeft
                fill={colors.tradebox.lowActive}
                width={10}
                height={10}
              />
            </span>
            <span>
              {parseFloat(Math.abs(Number(maxDailyLossPct)).toFixed(1)) * -1}%
            </span>
          </div>
        </div>
      </ChallengeDashboardItem>
      <ChallengeDashboardItem colors={colors} padding={20}>
        <div className="profit-drawdown-title">
          <span>{t`Profit Target`}</span>
          <span className={status === '4' ? 'checked' : 'un-checked'}>
            <CheckMark width="20" height="20" style={{ marginRight: '5px' }} />
            Goal Hit
          </span>
        </div>
        <div className="profit-drawdown-value">
          <span className={Number(profitGoalPct) <= 0 ? 'down' : 'up'}>
            {parseFloat(Number(profitGoalPct).toFixed(1))}%
          </span>
          <span style={{ marginTop: 5 }}>
            <span className={drawdown <= 0 ? 'down' : 'up'}>
              {`${drawdown < 0 ? '-' : ''}${formatCurrencyFn(
                Math.abs(drawdown),
                {
                  currencySymbol,
                  precision: 2,
                },
                false
              )}`}
            </span>
            /
            {formatCurrencyFn(
              (Number(profitGoalPct) * Number(initialBalance)) / 100,
              {
                currencySymbol,
                precision: 0,
              },
              false
            )}
          </span>
        </div>
      </ChallengeDashboardItem>
      {maxTradingDays && (
        <ChallengeDashboardItem colors={colors} padding={20}>
          <div className="profit-drawdown-title">
            <span>{t`Trading Days`}</span>
            <span
              className={maxTradingDaysReached ? 'checked-red' : 'un-checked'}
            >
              <CheckMark
                width="20"
                height="20"
                style={{ marginRight: '5px' }}
              />
              Limit Reached
            </span>
          </div>
          <div className="trading-days-value">
            <span className={maxTradingDaysReached ? 'red-color' : ''}>
              {currentTradingDays}
            </span>
            /{maxTradingDays}
          </div>
        </ChallengeDashboardItem>
      )}
      {maxDailyTrades && (
        <ChallengeDashboardItem colors={colors} padding={20}>
          <div className="profit-drawdown-title">
            <span>{t`Daily Trades Limit`}</span>
            <span
              className={maxDailyTradesReached ? 'checked-red' : 'un-checked'}
            >
              <CheckMark
                width="20"
                height="20"
                style={{ marginRight: '5px' }}
              />
              Limit Reached
            </span>
          </div>
          <div className="trading-days-value">
            <span className={maxDailyTradesReached ? 'red-color' : ''}>
              {totalTradesToday}
            </span>
            /{maxDailyTrades}
          </div>
        </ChallengeDashboardItem>
      )}
    </Panel>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  activeWallet: state.wallets.activeWallet,
  currencySymbol: getWalletCurrencySymbol(state),
  equity: state.wallets.equity,
  openPnL: state.wallets.openPnL,
  invested: state.wallets.invested,
  challengeDashboard: state.wallets.challengeDashboard,
  trades: state.trades,
})

export default connect(mapStateToProps, {
  actionSetChallengeDashboard,
})(ChallengeDashboardPanel)