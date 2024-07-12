/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import AssetGroups from './Groups'
import AssetsTable from './Table'
import { AssetPanel } from './styled'
import { AssetGroup } from './Groups/constants/groupsEnum'
import { IShortInstrument } from '../../ChartContainer/InstrumentsBar'
import {
  featuredInstrumentsIds,
  getFavoriteInstruments,
  shortOpenInstruments,
} from '../../selectors/instruments'
import { api } from '../../../core/createAPI'
import { actionSelectInstrument } from '../../../actions/trading'
import { actionAddInstrumentToTop } from '../../../actions/account'
import { searchInstruments } from '../../../shares/functions'
import Search from './Search'
import { actionSetAssetsPage } from '../../../actions/container'
import { INSTRUMENTS_PER_PAGE } from '../../constant'
import { IInstrument } from '../../../core/API'

interface ISearchAssetsPanelProps {
  colors: any
  favorites: any
  instruments: any
  siteID: number
  featuredInstrumentIds: string[]
  onClose: () => void
  actionSelectInstrument: (id: any) => void
  actionAddInstrumentToTop: (id: any) => void
  currentAssetsPage: number
  actionSetAssetsPage: (page: number, searchInstruments?: IInstrument[]) => void
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

const SearchAssetsPanel = ({
  colors,
  instruments,
  favorites,
  siteID,
  featuredInstrumentIds,
  actionAddInstrumentToTop,
  actionSelectInstrument,
  onClose,
  currentAssetsPage,
  actionSetAssetsPage,
}: ISearchAssetsPanelProps) => {
  const [selectedGroup, setSelectedGroup] = useState<AssetGroup | null>(null)
  const [search, setSearch] = useState<ISearch>({
    value: '',
    force: false,
  })
  const [assets, setAssets] = useState<any>([])
  const [recentlyTradedAssets, setRecentlyTradedAssets] = useState<any>([])
  const [topChangingAssets, setTopChangingAssets] = useState<any>([])
  const [featuredAssets, setFeaturedAssets] = useState<any>([])

  const isSearch = search.value.length > 0

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

  return (
    <AssetPanel colors={colors}>
      <Search
        onSearch={(value) => {
          if (!value) actionSetAssetsPage(1)
          setSearch({ ...search, value, reSubsribe: !!value })
        }}
        onClickClose={onClose}
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
      <AssetsTable
        instruments={assets}
        onClose={onClose}
        onLoadMore={() => {
          if ((currentAssetsPage + 1) * INSTRUMENTS_PER_PAGE < assets.length)
            if (isSearch && search.reSubsribe) {
              actionSetAssetsPage(currentAssetsPage + 1, assets)
            } else {
              actionSetAssetsPage(currentAssetsPage + 1)
            }
        }}
      />
    </AssetPanel>
  )
}

const mapStateToProps = (state: any) => ({
  colors: state.theme,
  siteID: state.registry.data.siteId,
  favorites: getFavoriteInstruments(state),
  featuredInstrumentIds: featuredInstrumentsIds(state),
  instruments: Object.values(shortOpenInstruments(state)),
  currentAssetsPage: state.container.currentAssetsPage,
})

export default connect(mapStateToProps, {
  actionSelectInstrument,
  actionAddInstrumentToTop,
  actionSetAssetsPage,
})(SearchAssetsPanel)
