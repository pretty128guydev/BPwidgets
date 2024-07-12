import { ResolutionString } from '../../charting_library_pro/charting_library/charting_library'

export interface ChartLibraryConfig {
  allowedLibraries: ChartType[]
  defaultLibrary: ChartType
  defaultTime: ResolutionString
}

export enum ChartType {
  Basic = '1',
  LightWeight = '2',
  TradingView = '3',
  TradingViewPro = '4',
}
