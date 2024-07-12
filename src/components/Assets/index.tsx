/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { actionSetContainer } from '../../actions/container'
import { ContainerState } from '../../reducers/container'
import AssetsSearch from './Search'
import AssetGroups from './Groups'
import AssetGroupsSideMode from './GroupsSideMode'
import AssetsTable from './Table'
import AssetsTableSideMode from './TableSideMode'
import { AssetPanel, AssetPanelSideMode, AssetsWrapper } from './styled'
import CloseButton from '../Sidebar/CloseBtn'
import { AssetGroup } from './Groups/constants/groupsEnum'
import InstrumentsBar, {
  IShortInstrument,
} from '../ChartContainer/InstrumentsBar'
import {
  featuredInstrumentsIds,
  getFavoriteInstruments,
  shortOpenInstruments,
} from '../selectors/instruments'
import { api } from '../../core/createAPI'
import { actionSelectInstrument } from '../../actions/trading'
import { actionAddInstrumentToTop } from '../../actions/account'
import { actionSetAssetsPage } from '../../actions/container'
import AssetsFeatured from './Featured'
import { searchInstruments } from '../../shares/functions'
import SearchSideMode from './SearchSideMode'
import { INSTRUMENTS_PER_PAGE } from '../constant'
import { IInstrument } from '../../core/API'

interface IAssetsPanelProps {
  colors: any
  favorites: any
  instruments: any
  siteID: number
  featuredInstrumentIds: string[]
  actionSetContainer: (state: ContainerState) => void
  actionSelectInstrument: (id: any) => void
  actionAddInstrumentToTop: (id: any) => void
  currentAssetsPage: number
  actionSetAssetsPage: (page: number, searchInstruments?: IInstrument[]) => void
  history: { [key: string]: number[][] }
}

interface ISearch {
  value: string
  force: boolean
  reSubsribe?: boolean
}

const fetchRecentlyTraded = async (
  platformID: string,
  siteId: number
): Promise<any> => {
  try {
    return await api.fetchRecentlyTraded(platformID, siteId)
  } catch (err) {
    console.log(err)
  }
}

const fetchTopChangingAssets = async (): Promise<any> => {
  try {
    return await api.fetchTopChangingAssets()
  } catch (err) {
    console.log(err)
  }
}

const AssetsPanel = ({
  colors,
  actionSetContainer,
  instruments,
  favorites,
  actionAddInstrumentToTop,
  actionSelectInstrument,
  siteID,
  featuredInstrumentIds,
  currentAssetsPage,
  actionSetAssetsPage,
  history,
}: IAssetsPanelProps) => {
  const [selectedGroup, setSelectedGroup] = useState<AssetGroup | null>(null)
  const [search, setSearch] = useState<ISearch>({
    value: '',
    force: false,
  })
  const [assets, setAssets] = useState<any>([])
  const [recentlyTradedAssets, setRecentlyTradedAssets] = useState<any>([])
  const [topChangingAssets, setTopChangingAssets] = useState<any>([])
  const [featuredAssets, setFeaturedAssets] = useState<any>([])

  const [isShowFull, setIsShowFull] = useState<boolean>(false)

  const isSearch = search.value.length > 0

  useEffect(() => {
    return () => actionSetAssetsPage(1)
  }, [])

  useEffect(() => {
    fetchRecentlyTraded('3', siteID).then((data) => {
      const assets = Object.keys(data)
        .map((id) =>
          instruments.find(
            ({ instrumentID }: any) => instrumentID === Number(id)
          )
        )
        .filter((asset) => asset)

      setRecentlyTradedAssets(assets)
    })

    setFeaturedAssets(instruments)

    fetchTopChangingAssets().then((data) => {
      const positive = Object.keys(data.positive)?.map((id) =>
        instruments.find(({ instrumentID }: any) => instrumentID === Number(id))
      )
      const negative = Object.keys(data.negative)?.map((id) =>
        instruments.find(({ instrumentID }: any) => instrumentID === Number(id))
      )

      const assets = [...positive, ...negative].filter((asset) => asset)

      setTopChangingAssets(assets)
    })

    // const featuredInstruments = featuredInstrumentIds
    //   .map((id) =>
    //     currentInstruments.find(({ instrumentID }: any) => instrumentID === id)
    //   )
    //   .filter((asset) => asset)

    // setFeaturedAssets(featuredInstruments)
  }, [siteID])

  useEffect(() => {
    let group

    switch (selectedGroup) {
      case AssetGroup.favorites:
        group = instruments.filter((i: IShortInstrument) =>
          favorites.includes(i.instrumentID)
        )
        break
      case AssetGroup.mostTraded:
        group = featuredAssets
        break
      case AssetGroup.recentlyAdded:
        group = recentlyTradedAssets
        break
      case AssetGroup.gainersLosers:
        group = topChangingAssets
        break
      default:
        group = instruments.filter(
          (i: IShortInstrument) => Number(i.type) === selectedGroup
        )
    }

    if (isSearch) {
      const currentInstruments = search.force ? group : instruments
      group = searchInstruments(currentInstruments, search.value)
    }
    if (!isSearch && selectedGroup === null) {
      setSelectedGroup(AssetGroup.mostTraded)
    }

    let sorted = [...group].sort((a, b) =>
      (b.tradingHours as any).isOpen ? -1 : 1
    )

    sorted = sorted.sort((a, b) =>
      (b.tradingHours as any).isOpen
        ? 1
        : (a.tradingHours as any).opensAt - (b.tradingHours as any).opensAt
    )

    if (search.reSubsribe) actionSetAssetsPage(1, sorted)

    setAssets(sorted)
  }, [search, selectedGroup, topChangingAssets, recentlyTradedAssets])

  useEffect(() => {
    if (search.value === '') {
      setSearch({ ...search, force: false, reSubsribe: false })
    }
  }, [search.value])

  if (isShowFull) {
    return (
      <AssetPanel>
        <InstrumentsBar isInAssets={true} />
        <AssetsWrapper colors={colors}>
          <CloseButton
            colors={colors}
            onClick={() => actionSetContainer(ContainerState.trade)}
          />
          <>
            <AssetsSearch
              onSearch={(value) => {
                if (!value) actionSetAssetsPage(1)
                setSearch({ ...search, value, reSubsribe: !!value })
              }}
            />
            <AssetGroups
              selected={isSearch && !search.force ? null : selectedGroup}
              onSetGroup={(value) => {
                actionSetAssetsPage(1)
                setSelectedGroup(value)
                if (isSearch) {
                  setSearch({
                    ...search,
                    force: true,
                    reSubsribe: value !== AssetGroup.none,
                  })
                }
              }}
            />
            <AssetsFeatured
              instruments={assets}
              history={history}
              onClose={(id) => {
                actionSetContainer(ContainerState.trade)
                actionAddInstrumentToTop(id)
                actionSelectInstrument(id)
              }}
            />
            <AssetsTable
              instruments={assets}
              history={history}
              onClose={() => actionSetContainer(ContainerState.trade)}
              onLoadMore={() => {
                if (
                  (currentAssetsPage + 1) * INSTRUMENTS_PER_PAGE <
                  assets.length
                )
                  if (isSearch && search.reSubsribe) {
                    actionSetAssetsPage(currentAssetsPage + 1, assets)
                  } else {
                    actionSetAssetsPage(currentAssetsPage + 1)
                  }
              }}
            />
          </>
        </AssetsWrapper>
      </AssetPanel>
    )
  }

  return (
    <AssetPanelSideMode colors={colors}>
      <SearchSideMode
        onSearch={(value) => {
          if (!value) actionSetAssetsPage(1)
          setSearch({ ...search, value, reSubsribe: !!value })
        }}
        onClickFullMode={() => {
          actionSetAssetsPage(1)
          setIsShowFull(true)
        }}
        onClickClose={() => actionSetContainer(ContainerState.trade)}
      />
      <AssetGroupsSideMode
        selected={isSearch && !search.force ? null : selectedGroup}
        onSetGroup={(value) => {
          actionSetAssetsPage(1)
          setSelectedGroup(value)
          if (isSearch) {
            setSearch({
              ...search,
              force: true,
              reSubsribe: value !== AssetGroup.none,
            })
          }
        }}
      />
      <AssetsTableSideMode
        instruments={assets}
        onLoadMore={() => {
          if ((currentAssetsPage + 1) * INSTRUMENTS_PER_PAGE < assets.length) {
            if (isSearch && search.reSubsribe) {
              actionSetAssetsPage(currentAssetsPage + 1, assets)
            } else {
              actionSetAssetsPage(currentAssetsPage + 1)
            }
          }
        }}
      />
    </AssetPanelSideMode>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  siteID: state.registry.data.siteId,
  favorites: getFavoriteInstruments(state),
  featuredInstrumentIds: featuredInstrumentsIds(state),
  instruments: Object.values(shortOpenInstruments(state)),
  currentAssetsPage: state.container.currentAssetsPage,
  history: state.registry.instrumentsHistory,
})

export default connect(mapStateToProps, {
  actionSetContainer,
  actionSelectInstrument,
  actionAddInstrumentToTop,
  actionSetAssetsPage,
})(AssetsPanel)
