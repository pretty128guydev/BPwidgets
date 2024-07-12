export interface ChartLibraryConfig {
  allowedLibraries: string[]
  defaultLibrary: string
  defaultTime: string
}

export interface Language {
  title: string
  icon: string
}

export interface AvailableUserLanguages {
  [prop: string]: Language
}

export interface CustomMenu {
  label: string
  icon: string
  url: string
  isExternal: boolean
}

export interface LogoLinkUrl {
  desktop: string
  mobile: string
}

export interface ChartPeriodOption {
  unit: string
  period: number
  periodLabel: string
  periodToolTip: string
}

export interface StepRule {
  minValue: number
  step: number
}

export interface SliderStepRules {
  stepRules: StepRule[]
}

export interface VideoList {
  title: string
  source: string
  image: string
}

export interface Videos {
  enabled: boolean
  order: number[]
  videoList: VideoList[]
}

export interface News {
  url: string
  enabled: boolean
}

export interface CryptoNews {
  url: string
  enabled: boolean
}

export interface VideoNews {
  url: string
  enabled: boolean
}

export interface WefinTheme {
  botAvatarInitials: string
  accent: string
  hideUploadButton: boolean
  sendBoxBackground: string
  sendBoxPlaceholderColor: string
  sendBoxTextColor: string
  sendBoxBorderTop: string
  backgroundColor: string
  bubbleBackground: string
  bubbleTextColor: string
  bubbleBorderStyle: string
  bubbleBorderRadius: number
  userAvatarBackgroundColor: string
  bubbleFromUserBackground: string
  bubbleFromUserTextColor: string
  bubbleFromUserBorderStyle: string
  bubbleFromUserBorderRadius: number
  suggestedActionBackground: string
  suggestedActionBorderRadius: number
  suggestedActionBorderWidth: number
  suggestedActionBorderColor: string
  suggestedActionTextColor: string
}

export interface Wefin {
  wefinEnabled: boolean
  wefinURL?: any
  wefinTheme: WefinTheme
}

export interface LeftPanel {
  videos: Videos
  news: News
  cryptoNews: CryptoNews
  videoNews: VideoNews
  wefin: Wefin
}

export interface SmsVerification {
  showCheckbox: boolean
  smsVerificationEnabled: boolean
}

export interface RegistrationMobileConfig {
  privacyLink: string
  termsLink: string
  redirectURL: string
  showDateOfBirth: boolean
  showPracticeRegistration: boolean
  smsVerification: SmsVerification
  biometricLogin: boolean
  showRegistration: boolean
  nativeRegistrationLink?: any
}

export interface AvailableBasePartnerCurrencies {
  eur: string
  usd: string
  jpy: string
  btc: string
  thb: string
  try: string
  usdt: string
  gcd: string
}

export interface PartnerConfig {
  chartLibraryConfig: ChartLibraryConfig
  logoUrl: string
  defaultLang: string
  defaultCurrency: string
  availableLanguages: string[]
  availableUserLanguages: AvailableUserLanguages
  depositUrl: string
  depositUrlExternal: boolean
  customMenu: CustomMenu[]
  brandName: string
  logoLinkUrl: LogoLinkUrl
  chartPeriodOptions: ChartPeriodOption[]
  hideHeaderOnEmbed: boolean
  showOneClickOpenTrade: boolean
  showOneClickCloseTrade: boolean
  registrationLink: string
  sliderStepRules: SliderStepRules
  customFeed: boolean
  allowDemo: boolean
  hideDemoButton: number
  hideWalletPicker: boolean
  basicView: boolean
  leftPanel: LeftPanel
  registrationMobileConfig: RegistrationMobileConfig
  availableBasePartnerCurrencies: AvailableBasePartnerCurrencies
  defaultBasePartnerCurrency: string
}

export interface Expiry {
  round: number
  expiry: number
  deadPeriod: number
}

export interface TradingConfigPerCurrency {
  [prop: string]: Currency
}

export interface LoginConfig {
  forgotPasswordLink?: any
  hideForgotPassword: boolean
}

export interface UserConfig {
  oneClickOpenTrade: boolean
  oneClickCloseTrade: boolean
  chartType: string
  chartResolution: string
  navigation: boolean
}

export interface Currency {
  currencyName: string
  currencySymbol: string
  conversionRate: number
  precision: number
  minStopLoss: number
  maxStopLoss: number
}

export interface AvailableCurrencies {
  [prop: string]: Currency
}

export interface InstrumentType {
  id: number
  label: string
  icon: string
}

export interface TradeActionMessages {
  noLeverage: string
  belowMinStake: string
  aboveMaxStake: string
  noTakeProfit: string
  noDirection: string
  walletNotLoaded: string
}

export interface Translations {
  tradeActionMessages: TradeActionMessages
}

export interface Registry {
  lsHost: string
  urlBaseSecure: string
  baseDomain: string
  isLoggedIn: boolean
  siteId: string
  partnerConfig: PartnerConfig
  tradingConfigPerCurrency: TradingConfigPerCurrency
  cdnUrl: string
  loginConfig: LoginConfig
  userConfig: UserConfig
  availableCurrencies: AvailableCurrencies
  instrumentTypes: InstrumentType[]
  translations: Translations
}

export interface RegistryResponse {
  success: boolean
  registry: Registry
}
