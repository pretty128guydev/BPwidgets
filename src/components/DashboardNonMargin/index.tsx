/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { DashboardWrapper } from './styled'
import DashboardCash from './Cash'
import DashboardBonus from './Bonus'
import DashboardTopTradesAssets from './TopTradedAssets'
import DashboardTradeVolume from './TradeVolume'
import DashboardRecentUpdates from './RecentUpdates'
import DashboardRecentTrades from './RecentTrades'
import CloseButton from '../Sidebar/CloseBtn'
import { api } from '../../core/createAPI'
import { ILeftPanel, IWalletDetails } from '../../core/API'
import { IDashboardData } from './interfaces'

interface IDashboardNonMarginProps {
  leftPanel: ILeftPanel
  isMobile: boolean
  colors: any
  onClose: () => void
  activeWallet: IWalletDetails
}

const fetchDashboardData = async (walletID: number): Promise<any> => {
  return (await api.fetchDashboard(
    walletID,
    (new Date().getTimezoneOffset() / 60) * -1
  )) as IDashboardData
}

const DashboardNonMargin = ({
  isMobile,
  colors,
  onClose,
  activeWallet,
}: IDashboardNonMarginProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [dashboardData, setDashboardData] = useState<IDashboardData | any>(
    undefined
  )

  useEffect(() => {
    fetchData()
  }, [activeWallet])

  const fetchData = () => {
    if (!loading) {
      setLoading(true)
      fetchDashboardData(activeWallet.walletID).then((data) => {
        setLoading(false)
        setDashboardData(data)
      })
    }
  }

  return (
    <DashboardWrapper colors={colors} isMobile={isMobile}>
      {!isMobile && <CloseButton colors={colors} onClick={onClose} />}
      {dashboardData && (
        <>
          <DashboardCash />
          <DashboardBonus />
          <DashboardTopTradesAssets
            trades={dashboardData.walletStats.trade.byInstrumentId}
          />
          <DashboardTradeVolume trades={dashboardData.walletStats.trade} />
          <DashboardRecentUpdates />
          <DashboardRecentTrades />
        </>
      )}
    </DashboardWrapper>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isMobile: state.registry.isMobile,
  leftPanel: state.registry.data.partnerConfig.leftPanel,
  activeWallet: state.wallets.activeWallet,
})

export default connect(mapStateToProps)(DashboardNonMargin)
