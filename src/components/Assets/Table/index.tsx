/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { t } from 'ttag'
import {
  AssetsTableChange,
  AssetsTableColumn,
  AssetsTableHeader,
  AssetsTableHoverItem,
  AssetsTableRow,
  AssetsTableSpace,
  AssetsTableTBody,
  AssetsTableTHead,
} from './styled'
import { IInstrument, IUserInfo } from '../../../core/API'
import {
  actionSelectInstrument,
  actionSetCurrentDirection,
} from '../../../actions/trading'
import ImageWrapper from '../../ui/ImageWrapper'
import AssetPlaceholder from '../../ChartContainer/InstrumentsBar/asset-placeholder.svg'
import { isLoggedIn } from '../../selectors/loggedIn'
import { defaultTopAssets, getUserInfo } from '../../selectors/instruments'
import InstrumentDailyChange from '../../ChartContainer/Instruments/instrumentDailyChange'
import { IOpenTrade } from '../../../core/interfaces/trades'
import FavIcon from '../../ui/FavIcon'
import TopIcon from '../../ui/TopIcon'
import TableChart from './chart'
import { actionAddInstrumentToTop } from '../../../actions/account'
import { LocaleDate } from '../../../core/localeFormatDate'
import TradeBuyButton from './TradeBuyButton'
import TradeSellButton from './TradeSellButton'
import { QuotesMap } from '../../../reducers/quotes'
import { throttle } from 'lodash'
import GlobalLoader from '../../ui/GlobalLoader'
import { INSTRUMENTS_PER_PAGE } from '../../constant'

interface IAssetsTableProps {
  colors: any
  history: any
  instruments: IInstrument[]
  actionSelectInstrument: (id: any) => void
  onClose: () => void
  isLoggedIn: boolean
  userInfo: IUserInfo | null
  defaultTopAssets: any[]
  openTrades: IOpenTrade[]
  actionAddInstrumentToTop: (id: any) => void
  actionSetCurrentDirection: (direction: number) => void
  quotes: QuotesMap
  currentAssetsPage: number
  onLoadMore: () => void
  isLoadMore: boolean
}

const AssetsTable = ({
  colors,
  history,
  instruments,
  actionSelectInstrument,
  onClose,
  openTrades,
  userInfo,
  isLoggedIn,
  actionAddInstrumentToTop,
  defaultTopAssets,
  actionSetCurrentDirection,
  quotes,
  currentAssetsPage,
  onLoadMore,
  isLoadMore,
}: IAssetsTableProps) => {
  const topAssets = isLoggedIn
    ? userInfo?.topAssets
    : defaultTopAssets.map(({ instrumentID }) => instrumentID)

  const TableWrapperRef = useRef<any>(null)
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState<number>(0)

  const TableBodyWrapperRef = useRef<any>(null)
  const [wrapperViewPort, setWrapperViewPort] = useState<any>({
    top: null,
    height: null,
  })
  useEffect(() => {
    if (TableWrapperRef.current) {
      const maxHeight =
        TableWrapperRef.current.offsetTop +
        TableWrapperRef.current.offsetParent.offsetTop +
        (isLoggedIn ? 163 : 131)
      setTableBodyMaxHeight(maxHeight)
    }
  }, [TableWrapperRef.current?.clientHeight])

  useEffect(() => {
    setViewPort()
  }, [TableBodyWrapperRef.current?.clientHeight])

  useEffect(() => {
    TableBodyWrapperRef.current.scrollTop = 0
  }, [instruments])

  const selectInstrument = (id: number) => {
    actionSelectInstrument(id)
    onClose()
  }

  const getOpenTime = (instrument: any) => {
    const { opensAt } = instrument.tradingHours
    if (opensAt)
      return (
        t`Opens in` +
        ' ' +
        LocaleDate.formatDistanceStrict(opensAt, new Date().getTime())
      )
    return ''
  }

  const getTradesCount = (id: number): number | string => {
    const count = openTrades.filter(
      ({ instrumentID }) => instrumentID === Number(id)
    ).length
    return count === 0 ? '' : count
  }

  const setViewPort = () => {
    if (TableBodyWrapperRef.current) {
      const { scrollTop: top, clientHeight: height } =
        TableBodyWrapperRef.current

      setWrapperViewPort({ top, height })
    }
  }

  const onClick = (id: number) => {
    selectInstrument(id)
    actionAddInstrumentToTop(id)
  }

  const updateOnLoadMore = throttle(() => {
    onLoadMore()
  }, 3000)

  const handleScroll = useCallback(
    (e) => {
      const isEnd =
        e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
      if (isEnd && !isLoadMore) {
        updateOnLoadMore()
      }
    },
    [isLoadMore]
  )

  return (
    <AssetsTableSpace ref={TableWrapperRef}>
      <AssetsTableTHead>
        <AssetsTableRow>
          <AssetsTableHeader
            colors={colors}
            widthPercent={14}
            minWidth={65}
          >{t`instrument`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={14}
            minWidth={111}
          >{t`description`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={10}
            minWidth={70}
          >{t`status`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={13}
            alignCenter={true}
            minWidth={72}
          >
            {t`24h change`}
          </AssetsTableHeader>
          {
            <AssetsTableHeader
              colors={colors}
              widthPercent={8.5}
              alignCenter={true}
              minWidth={90}
            >
              {t`Sell`}
            </AssetsTableHeader>
          }
          {
            <AssetsTableHeader
              colors={colors}
              widthPercent={8.5}
              alignCenter={true}
              minWidth={90}
            >
              {t`Buy`}
            </AssetsTableHeader>
          }
          <AssetsTableHeader
            colors={colors}
            widthPercent={14}
            alignCenter={true}
            minWidth={76}
          >{t`open trades`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={9}
            alignCenter={true}
            minWidth={72}
          >{t`add/remove`}</AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={9}
            alignCenter={true}
            minWidth={72}
          >{t`actions`}</AssetsTableHeader>
        </AssetsTableRow>
      </AssetsTableTHead>
      <AssetsTableTBody
        className="scrollable"
        onScroll={(e) => {
          setViewPort()
          handleScroll(e)
        }}
        ref={TableBodyWrapperRef}
        maxHeight={tableBodyMaxHeight}
      >
        {instruments.map((item, key) => {
          if (key >= currentAssetsPage * INSTRUMENTS_PER_PAGE) return <></>

          return (
            <AssetsTableRow key={key}>
              <AssetsTableColumn
                colors={colors}
                color={colors.defaultText}
                bold={true}
                widthPercent={14}
                minWidth={65}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(item.instrumentID)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                >
                  <ImageWrapper
                    alt={item.name}
                    src={`${process.env.PUBLIC_URL}/static/icons/instruments/${item.instrumentID}.svg`}
                    placeholderSrc={AssetPlaceholder}
                  />
                  <AssetsTableHoverItem colors={colors}>
                    {item.name}
                  </AssetsTableHoverItem>
                </div>
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                color={colors.defaultText}
                widthPercent={14}
                minWidth={111}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(item.instrumentID)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                >
                  {item.name}
                </div>
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                widthPercent={10}
                minWidth={70}
                color={colors.accentDefault}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(item.instrumentID)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                >
                  {item.isOpen ? t`Open` : ''}
                  {item.isOpen ? '' : getOpenTime(item)}
                </div>
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                widthPercent={13}
                minWidth={72}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(item.instrumentID)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                >
                  <AssetsTableChange>
                    <InstrumentDailyChange
                      instrumentID={item.instrumentID}
                      colors={colors}
                    />
                    {item.isOpen ? (
                      <TableChart
                        index={key}
                        wrapperViewPort={wrapperViewPort}
                        instrumentID={item.instrumentID}
                        data={history[item.instrumentID]}
                      />
                    ) : (
                      ''
                    )}
                  </AssetsTableChange>
                </div>
              </AssetsTableColumn>
              {
                <AssetsTableColumn
                  disabled={!item.isOpen}
                  colors={colors}
                  widthPercent={8.5}
                  minWidth={90}
                  alignCenter={true}
                >
                  <TradeSellButton
                    instrumentID={item.instrumentID}
                    quote={quotes[item.instrumentID]}
                    onClick={() => {
                      actionSetCurrentDirection(-1)
                      onClick(item.instrumentID)
                    }}
                  />
                </AssetsTableColumn>
              }
              {
                <AssetsTableColumn
                  disabled={!item.isOpen}
                  colors={colors}
                  widthPercent={8.5}
                  minWidth={90}
                  alignCenter={true}
                >
                  <TradeBuyButton
                    instrumentID={item.instrumentID}
                    quote={quotes[item.instrumentID]}
                    onClick={() => {
                      actionSetCurrentDirection(1)
                      onClick(item.instrumentID)
                    }}
                  />
                </AssetsTableColumn>
              }
              <AssetsTableColumn
                disabled={!item.isOpen}
                colors={colors}
                widthPercent={14}
                minWidth={76}
                alignCenter={true}
              >
                {getTradesCount(item.instrumentID)}
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                disabled={!item.isOpen}
                widthPercent={9}
                minWidth={72}
                alignCenter={true}
              >
                <TopIcon
                  isTop={!!topAssets?.includes(item.instrumentID)}
                  instrumentId={item.instrumentID}
                />
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                disabled={!item.isOpen}
                widthPercent={9}
                minWidth={72}
                alignCenter={true}
              >
                <FavIcon
                  isFav={!!userInfo?.favAssets?.includes(item.instrumentID)}
                  instrumentId={item.instrumentID}
                />
              </AssetsTableColumn>
            </AssetsTableRow>
          )
        })}
        {isLoadMore && (
          <AssetsTableRow key="load-more-row">
            <td
              colSpan={9}
              style={{
                position: 'relative',
                height: 60,
              }}
            >
              <GlobalLoader containerId="mainLoaderLoadmore" loaderWidth={40} />
            </td>
          </AssetsTableRow>
        )}
      </AssetsTableTBody>
    </AssetsTableSpace>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  isLoggedIn: isLoggedIn(state),
  userInfo: getUserInfo(state),
  openTrades: state.trades.open,
  defaultTopAssets: defaultTopAssets(state),
  quotes: state.quotes,
  isLoadMore: state.container.loadingMoreAssets,
  currentAssetsPage: state.container.currentAssetsPage,
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionAddInstrumentToTop,
  actionSetCurrentDirection,
})(AssetsTable)
