/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { actionSetContainer } from '../../actions/container'
import { actionSetChallengeDashboard } from '../../actions/wallets'
import { ContainerState } from '../../reducers/container'
import { Panel, PanelSideMode, Wrapper, ChallengeDashboardItem } from './styled'
import InstrumentsBar from '../ChartContainer/InstrumentsBar'
import { api } from '../../core/createAPI'
import HeaderSideMode from './HeaderSideMode'
import { t } from 'ttag'
import Images from '../../assets/images'
import { ReactComponent as CheckMark } from './icons/checkMark.svg'
import { ReactComponent as MiniIcon } from './icons/miniIcon.svg'
import { ReactComponent as CloseIcon } from './icons/closeIcon.svg'
import { ReactComponent as Avatar } from './icons/avatarIcon.svg'
import DonutChart from './DonutChart'
import { IInstrument, IWalletDetails } from '../../core/API'
import {
  IChallengeDashboardData,
  IDashboardData,
  IDashboardTrade,
} from '../Dashboard/interfaces'
import { IPieChartData } from '../../core/interfaces/highcharts'
import LineChart from './LineChart'
import { getWalletCurrencySymbol } from '../selectors/currency'
import { LocaleDate } from '../../core/localeFormatDate'
import { formatCurrencyFn } from '../../core/currency'
import BarChart from '../Dashboard/TradeVolume/BarChart'
import RecentTradesTable from '../Dashboard/RecentTrades/table'
import DashboardDownload from '../Dashboard/RecentTrades/download'
import moment from 'moment'

interface IChallengeDashboardPanelNonMarginProps {
  colors: any
  actionSetContainer: (state: ContainerState) => void
  activeWallet: IWalletDetails
  instruments: IInstrument[] | any
  currencySymbol: string
  equity: number
  openPnL: number
  challengeDashboard: IChallengeDashboardData
  actionSetChallengeDashboard: (data: IChallengeDashboardData) => void
  trades: any
}

const DAY_TIME_STEP = 1000 * 60 * 60 * 24 // milliseconds * seconds * hour * day
const STATISTIC_DATES = 30

const barChartData = (
  list: { [key: string]: IDashboardTrade },
  colors: any
) => {
  const todayDate = new Date()
  const date = todayDate.getTime() + todayDate.getTimezoneOffset() * 60 * 1000 //milliseconds in minute

  return new Array(STATISTIC_DATES).fill('').map((item, index) => {
    const searchDate = date - index * DAY_TIME_STEP
    const chartDate = LocaleDate.format(searchDate, 'yyyy-MM-dd')
    const dayData = list[chartDate]

    const value = {
      name: LocaleDate.format(searchDate, 'MM/dd'),
      x: searchDate,
      y: 0,
      color: colors.chartTradingViewPrimary,
    }

    if (dayData) {
      value.y = dayData.volume
    }

    return value
  })
}

const fetchDashboardData = async (walletID: number): Promise<any> => {
  return (await api.fetchDashboard(
    walletID,
    (new Date().getTimezoneOffset() / 60) * -1
  )) as IDashboardData
}

const fetchChallengeDashboard = async (challengeID: number): Promise<any> => {
  return await api.fetchChallengeDashboard(challengeID)
}

const ChallengeDashboardPanelNonMargin = ({
  colors,
  actionSetContainer,
  activeWallet,
  instruments,
  currencySymbol,
  equity,
  openPnL,
  challengeDashboard,
  actionSetChallengeDashboard,
  trades,
}: IChallengeDashboardPanelNonMarginProps) => {
  const { state: challengeDashboardState } = challengeDashboard
  const [isShowFull, setIsShowFull] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [dashboardData, setDashboardData] = useState<IDashboardData | any>(
    undefined
  )
  const [chartData, setChartData] = useState<IPieChartData[] | null>(null)
  const [barchartData, setBarChartData] = useState<any>(null)

  const fetchData = async () => {
    if (!loading) {
      setLoading(true)

      const data = await fetchDashboardData(activeWallet.walletID)
      setDashboardData(data)

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

  useEffect(() => {
    if (dashboardData) {
      const trades = dashboardData.walletStats.trade.byInstrumentId
      const { closedTrades = {}, openedTrades = {} } = trades

      const allTrades: string[] = [
        ...new Set([
          ...Object.keys(closedTrades),
          ...Object.keys(openedTrades),
        ]),
      ] as string[]

      const tradesData: IPieChartData[] = allTrades
        .map((key: string) => {
          const instrument: IInstrument = instruments.find(
            (instrument: IInstrument) => instrument.instrumentID === Number(key)
          )
          const openedTradesCount: number = openedTrades[key]?.count || 0
          const closedTradesCount: number = closedTrades[key]?.count || 0

          return {
            name: instrument?.name as string,
            y: openedTradesCount + closedTradesCount,
          }
        }, [])
        .sort((first, second) => second.y - first.y)

      const topTrades = tradesData.splice(0, 5)
      const otherTrades = tradesData.reduce(
        (prev, curr) => {
          return { ...prev, y: prev.y + curr.y }
        },
        { name: t`Other`, y: 0 }
      )

      if (otherTrades.y !== 0) {
        topTrades.push(otherTrades)
      }
      setChartData(topTrades)

      const barData = barChartData(
        dashboardData.walletStats.trade.byDateWithOffset.dates,
        colors
      )
      setBarChartData(barData)
    }
  }, [dashboardData])

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

  const { open, closed } = trades

  const totalTradesToday = [...open, ...closed].filter(({ tradeTime }) =>
    moment(tradeTime).isSame(moment(), 'day')
  ).length

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

  const { availableCash, reserved } = activeWallet

  const [drawdown, setDrawdown] = useState<number>(
    Number(equity) - Number(initialBalance)
  )

  const [drawdownPercent, setDrawdownPercent] = useState<number>(
    (drawdown / Number(initialBalance)) * 100
  )

  const dailyDrawdownPercent =
    (Math.abs(Number(lastDayLoss)) / Number(initialBalance)) * 100
  const profitTarget = (Number(profitGoalPct) * Number(initialBalance)) / 100
  const balancePercent = parseFloat(
    (
      ((Number(availableCash) - Number(initialBalance)) /
        Number(initialBalance)) *
      100
    ).toFixed(2)
  )
  const equityPercent = parseFloat(
    (
      ((Number(equity) - Number(initialBalance)) / Number(initialBalance)) *
      100
    ).toFixed(2)
  )

  useEffect(() => {
    const reCalcDrawdown = Number(equity) - Number(initialBalance)
    const reCalcDrawdownPercent =
      (reCalcDrawdown / Number(initialBalance)) * 100
    if (drawdownPercent > reCalcDrawdownPercent) {
      setDrawdown(reCalcDrawdown)
      setDrawdownPercent(reCalcDrawdownPercent)
    }
  }, [equity])

  if (isShowFull) {
    const percentOdometer = Math.abs(Number(maxTotalLossPct) / 5) * -1

    return (
      <Panel>
        <InstrumentsBar isInAssets={true} />
        <Wrapper className="scrollable" colors={colors}>
          <span className="buttons-group">
            <span
              className="icon-mini-mode"
              onClick={() => setIsShowFull(false)}
            >
              <MiniIcon width="30" height="30" fill="#9fabbd" />
            </span>
            <span
              className="icon-close"
              onClick={() => actionSetContainer(ContainerState.trade)}
            >
              <CloseIcon width="30" height="30" fill="#9fabbd" />
            </span>
          </span>
          <div className="challenge-dashboard-container">
            <div className="header-challenge-dashboard">
              <Avatar width="70" height="70" />
              <span className="title">{title}</span>
            </div>
            <div className="dashboard-item dashboard-item-balance">
              <div className="dashboard-item-title">{t`Balance`}</div>
              <div className="dashboard-item-value">
                {formatCurrencyFn(
                  availableCash,
                  {
                    currencySymbol,
                    precision: 2,
                  },
                  false
                )}
              </div>
              <div
                className={`dashboard-item-change ${
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
            <div className="dashboard-item dashboard-item-equity">
              <div className="dashboard-item-title">{t`Equity`}</div>
              <div className="dashboard-item-value">
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
                className={`dashboard-item-change ${
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
            <div className="dashboard-item dashboard-item-freemargin">
              <div className="dashboard-item-title">{t`Invested`}</div>
              <div className="dashboard-item-value up">
                {formatCurrencyFn(
                  reserved,
                  {
                    currencySymbol,
                    precision: 2,
                  },
                  false
                )}
              </div>
            </div>
            <div className="dashboard-item dashboard-item-marginused">
              <div className="dashboard-item-title">{t`Open P&L`}</div>
              <div
                className={`dashboard-item-value ${
                  openPnL > 0 ? 'up' : 'down'
                }`}
              >
                {`${openPnL < 0 ? '-' : ''}${formatCurrencyFn(
                  Math.abs(openPnL),
                  {
                    currencySymbol,
                    precision: 2,
                  },
                  false
                )}`}
              </div>
            </div>
            <div className="dashboard-item dashboard-item-profittarget">
              <div className="dashboard-item-title">{t`Profit target`}</div>
              <div className="dashboard-item-value">
                {formatCurrencyFn(
                  profitTarget,
                  {
                    currencySymbol,
                    precision: 2,
                  },
                  false
                )}
              </div>
              <div
                className={`dashboard-item-change ${
                  Number(profitGoalPct) <= 0 ? 'down' : 'up'
                }`}
              >
                <span>
                  {Number(profitGoalPct) <= 0 ? (
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
                <span>{parseFloat(Number(profitGoalPct).toFixed(1))}%</span>
              </div>
            </div>
            <div className="dashboard-item dashboard-item-drawdown">
              <div className="dashboard-item-title">{t`Total drawdown`}</div>
              <div className="dashboard-item-value">
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
                className={`dashboard-item-change ${
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
            <div className="dashboard-item dashboard-item-drawdownlimit">
              <div className="dashboard-item-title">{t`Drawdown limit`}</div>
              <div className="dashboard-item-value">
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
              <div className="dashboard-item-change down">
                <span>
                  <Images.ArrowDownLeft
                    fill={colors.tradebox.lowActive}
                    width={10}
                    height={10}
                  />
                </span>
                <span>
                  {parseFloat(Math.abs(Number(maxTotalLossPct)).toFixed(1)) *
                    -1}
                  %
                </span>
              </div>
            </div>
            <div
              className="dashboard-item-top-assets"
              style={{ display: 'flex' }}
            >
              <div className="dashboard-item" style={{ flex: 1 }}>
                <div className="dashboard-item-title">{t`Top traded assets`}</div>
                <div className="top-assets-container">
                  <DonutChart data={chartData as IPieChartData[]} />
                </div>
              </div>
              <div className="dashboard-item flex-column">
                <div className="dashboard-item-title">{t`Drawdown risk-o-meter`}</div>
                <div className="drawdown-risk-o-meter-container">
                  <div className="risk-o-meter-chart-container">
                    <div className="risk-o-meter-chart">
                      <span className="zero-percent">0%</span>
                      <ul className="chart-skills">
                        <li>
                          <span>
                            {parseFloat((percentOdometer * 1).toFixed(1))}%
                          </span>
                        </li>
                        <li>
                          <span>
                            {parseFloat((percentOdometer * 2).toFixed(1))}%
                          </span>
                        </li>
                        <li>
                          <span>
                            {parseFloat((percentOdometer * 3).toFixed(1))}%
                          </span>
                        </li>
                        <li>
                          <span>
                            {parseFloat((percentOdometer * 4).toFixed(1))}%
                          </span>
                        </li>
                        <li>
                          <span>
                            {parseFloat(
                              (Math.abs(Number(maxTotalLossPct)) * -1).toFixed(
                                1
                              )
                            )}
                            %
                          </span>
                        </li>
                      </ul>
                      <div className="semi-cycle" />
                      <div className="clockwise-container">
                        <div
                          className="position-relative"
                          style={{
                            transform: `rotate(${
                              drawdownPercent > 0
                                ? 0
                                : (
                                    180 *
                                    (Math.abs(drawdownPercent) /
                                      Math.abs(Number(maxTotalLossPct)))
                                  ).toFixed(1)
                            }deg)`,
                          }}
                        >
                          <div className="clockwise"></div>
                          <span className="clockwise-dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="low-high-risk">
                    <span className="low-risk">{t`Low risk`}</span>
                    <span className="high-risk">{t`High risk`}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-item dashboard-item-volume-per-day">
              <div className="dashboard-item-title">{t`Volume Per Day`}</div>
              {dashboardData && (
                <div className="bar-chart-container">
                  <BarChart
                    data={barchartData}
                    currencySymbol={currencySymbol}
                    colors={colors}
                  />
                </div>
              )}
            </div>
            <div className="dashboard-item dashboard-item-line-chart">
              <LineChart
                challengeDashboard={challengeDashboard}
                currencySymbol={currencySymbol}
              />
            </div>
            <div className="dashboard-item dashboard-item-recent-trades">
              <div className="dashboard-item-title">
                <span>{t`Recent Trades`}</span>
                <span style={{ float: 'right' }}>
                  <DashboardDownload />
                </span>
              </div>
              <div style={{ margin: '20px -20px' }}>
                <RecentTradesTable />
              </div>
            </div>
          </div>
        </Wrapper>
      </Panel>
    )
  }

  return (
    <PanelSideMode className="scrollable" colors={colors}>
      <HeaderSideMode
        colors={colors}
        onClickFullMode={() => setIsShowFull(true)}
        onClickClose={() => actionSetContainer(ContainerState.trade)}
      />
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
              availableCash,
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
            <span>{t`Trading Days Limit`}</span>
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
    </PanelSideMode>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  activeWallet: state.wallets.activeWallet,
  instruments: Object.values(state.instruments),
  currencySymbol: getWalletCurrencySymbol(state),
  equity: state.wallets.equity,
  openPnL: state.wallets.openPnL,
  challengeDashboard: state.wallets.challengeDashboard,
  trades: state.trades,
})

export default connect(mapStateToProps, {
  actionSetContainer,
  actionSetChallengeDashboard,
})(ChallengeDashboardPanelNonMargin)
