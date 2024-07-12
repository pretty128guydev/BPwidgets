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
import { IInstrument, IUserInfo } from '../../../../core/API'
import { actionSelectInstrument } from '../../../../actions/trading'
import { isLoggedIn } from '../../../selectors/loggedIn'
import { getUserInfo } from '../../../selectors/instruments'
import InstrumentDailyChange, {
  getChange,
} from '../../../ChartContainer/Instruments/instrumentDailyChange'
import FavIcon from '../../../ui/FavIcon'
import { actionAddInstrumentToTop } from '../../../../actions/account'
import { QuotesMap } from '../../../../reducers/quotes'
import { debounce } from 'lodash'
import GlobalLoader from '../../../ui/GlobalLoader'
import { INSTRUMENTS_PER_PAGE } from '../../../constant'

interface IAssetsTableProps {
  colors: any
  instruments: IInstrument[]
  actionSelectInstrument: (id: any) => void
  isLoggedIn: boolean
  userInfo: IUserInfo | null
  actionAddInstrumentToTop: (id: any) => void
  quotes: QuotesMap
  onClose: () => void
  currentAssetsPage: number
  onLoadMore: () => void
  isLoadMore: boolean
}

const AssetsTable = ({
  colors,
  instruments,
  actionSelectInstrument,
  userInfo,
  isLoggedIn,
  actionAddInstrumentToTop,
  quotes,
  onClose,
  currentAssetsPage,
  onLoadMore,
  isLoadMore,
}: IAssetsTableProps) => {
  const TableWrapperRef = useRef<any>(null)
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState<number>(0)

  const TableBodyWrapperRef = useRef<any>(null)

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
    TableBodyWrapperRef.current.scrollTop = 0
  }, [instruments])

  const selectInstrument = (id: number) => {
    actionSelectInstrument(id)
    onClose()
  }

  const onClick = (id: number) => {
    selectInstrument(id)
    actionAddInstrumentToTop(id)
  }

  const updateOnLoadMore = debounce(() => {
    onLoadMore()
  }, 2000)

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
            widthPercent={35}
          >{t`instrmnt`}</AssetsTableHeader>
          <AssetsTableHeader colors={colors} widthPercent={35}>
            {t`price`}
          </AssetsTableHeader>
          <AssetsTableHeader colors={colors} widthPercent={20}>
            {t`chg %`}
          </AssetsTableHeader>
          <AssetsTableHeader
            colors={colors}
            widthPercent={10}
            alignCenter={true}
          ></AssetsTableHeader>
        </AssetsTableRow>
      </AssetsTableTHead>
      <AssetsTableTBody
        className="scrollable"
        ref={TableBodyWrapperRef}
        maxHeight={tableBodyMaxHeight}
        onScroll={handleScroll}
      >
        {instruments.map((item, key) => {
          if (key > currentAssetsPage * INSTRUMENTS_PER_PAGE) return <></>

          const quote = quotes[item.instrumentID]
          const change: any = getChange(quote, item)

          return (
            <AssetsTableRow key={key}>
              <AssetsTableColumn
                colors={colors}
                color={colors.secondaryText}
                bold={true}
                widthPercent={35}
                minWidth={85}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(item.instrumentID)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                >
                  <AssetsTableHoverItem colors={colors}>
                    {item.name}
                  </AssetsTableHoverItem>
                </div>
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                widthPercent={35}
                minWidth={85}
                disabled={!item.isOpen}
              >
                <div
                  onClick={() => onClick(item.instrumentID)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                    color:
                      change >= 0
                        ? colors.tradebox.highText
                        : colors.tradebox.lowText,
                  }}
                >
                  {quote?.last || ''}
                </div>
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                widthPercent={20}
                minWidth={70}
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
                  </AssetsTableChange>
                </div>
              </AssetsTableColumn>
              <AssetsTableColumn
                colors={colors}
                disabled={!item.isOpen}
                widthPercent={10}
                minWidth={30}
                alignCenter={true}
              >
                <div
                  className="fav-icon-container"
                  style={
                    !!userInfo?.favAssets?.includes(item.instrumentID)
                      ? { visibility: 'visible' }
                      : {}
                  }
                >
                  <FavIcon
                    isFav={!!userInfo?.favAssets?.includes(item.instrumentID)}
                    instrumentId={item.instrumentID}
                    hideTooltip={true}
                  />
                </div>
              </AssetsTableColumn>
            </AssetsTableRow>
          )
        })}
        {isLoadMore && (
          <AssetsTableRow key="load-more-row">
            <td
              colSpan={4}
              style={{
                position: 'relative',
                height: 50,
              }}
            >
              <GlobalLoader containerId="mainLoaderLoadmore" loaderWidth={30} />
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
  quotes: state.quotes,
  currentAssetsPage: state.container.currentAssetsPage,
  isLoadMore: state.container.loadingMoreAssets,
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionAddInstrumentToTop,
})(AssetsTable)
