import { IGame } from '../../../reducers/games'
import { IPeriod } from '../../ChartContainer/period'

const getDeadPeriod = (gameTime: number, game: IGame, chartPeriod: IPeriod) => {
  if (!chartPeriod) return 0
  const { deadPeriod } = game
  return gameTime - deadPeriod * 1000
}

const getGameTime = (game: IGame, chartPeriod: IPeriod) => {
  if (!chartPeriod) return 0
  const { timestamp } = game
  return Number(timestamp)
}

const getMaxGameTime = (
  maxExtendTime: number,
  gameTime: number,
  period: number,
  lastTime: number,
  isDeadTime: boolean = true
) => {
  let result = 0
  if (gameTime / 1000 > maxExtendTime) {
    result = isDeadTime ? maxExtendTime - 1000 * 8 : maxExtendTime - 1000 * 12
  } else {
    result = gameTime / 1000
  }

  const minTime = isDeadTime
    ? lastTime + period * 60 * 1000 * 2
    : lastTime + period * 60 * 1000
  if (gameTime < minTime) {
    result =
      (isDeadTime
        ? minTime + period * 60 * 1000 * 2
        : minTime + period * 60 * 1000) / 1000
  }
  return result - (result % (period * 60))
}

const overrideChartCss = (options: {
  upColor: string
  upColorCheckBoxBackground: string
}) => {
  return `
    .tab-DggvOZTm.active-DggvOZTm,
    .tab-DggvOZTm.active-DggvOZTm span,
    .button-xRobF0EE.size-small-xRobF0EE.color-brand-xRobF0EE.variant-primary-xRobF0EE {
      background-color: ${options.upColor} !important;
      color: #ffffff !important;
      border-color: ${options.upColor} !important;
    }
    .button-xRobF0EE.size-small-xRobF0EE.color-brand-xRobF0EE.variant-secondary-xRobF0EE {
      color: ${options.upColor} !important;
      border-color: ${options.upColor} !important;
      cursor: pointer;
    }
    .button-xRobF0EE.size-small-xRobF0EE.color-brand-xRobF0EE.variant-secondary-xRobF0EE:hover {
      color: #ffffff !important;
      border-color: ${options.upColor} !important;
      background-color: ${options.upColor} !important;
      cursor: pointer;
    }
    .inline-2yU8ifXU .isActive-2Vpz_LXc .js-button-text,
    .inline-2yU8ifXU .isActive-2Vpz_LXc .icon-2Vpz_LXc,
    .sliderRow-1emAA4_D.tabs-3I2ohC86 .isActive-3SbREAgE,
    .button-5-QHyx-s.isActive-5-QHyx-s  .icon-5-QHyx-s,
    .highlighted-1Qud56dI.highlightedText-ZzQNZGNo,
    .symbolTitle-ZzQNZGNo .highlighted-1Qud56dI,
    .title-1gYObTuJ .highlighted-1Qud56dI,
    .tab-1KEqJy8_.tab-3I2ohC86.active-3I2ohC86,
    .tab-1KEqJy8_.tab-3I2ohC86.active-3I2ohC86:hover,
    .tab-1KEqJy8_.withHover-1KEqJy8_:hover
    {
      color: ${options.upColor} !important;
    }

    .day-3r0qUNSu.selected-3r0qUNSu.currentDay-3r0qUNSu,
    .item-2IihgTnv.withIcon-2IihgTnv.isActive-2IihgTnv,
    .centerElement-RnpzRzG6 .container-113jHcZc,
    .sliderRow-1emAA4_D.tabs-3I2ohC86 .slider-3I2ohC86.slider-3GYrNsPp .inner-3GYrNsPp,
    .dropdown-2R6OKuTS .item-2IihgTnv.isActive-2IihgTnv,
    .slider-3RfwXbxu.inner-3RfwXbxu,
    .item-2IihgTnv.isActive-2IihgTnv.hovered-2IihgTnv,
    .day-3r0qUNSu.selected-3r0qUNSu.isOnHighlightedEdge-3r0qUNSu,
    .day-3r0qUNSu.isOnHighlightedEdge-3r0qUNSu.currentDay-3r0qUNSu,
    .day-3r0qUNSu::after,
    .day-3r0qUNSu.isOnHighlightedEdge-3r0qUNSu,
    .day-3r0qUNSu.selected-3r0qUNSu,
    .inner-3RfwXbxu
    {
      background-color: ${options.upColor} !important;
      border-color: ${options.upColor} !important;
      color: #ffffff !important;
    }

    .box-2eXD4rIf.check-2eXD4rIf {
      background-color: ${options.upColorCheckBoxBackground} !important;
      border-color: ${options.upColor} !important;
      color: #ffffff !important;
    }

    .highlight-QDd7xRJ1.shown-QDd7xRJ1
    {
      border-color: ${options.upColor} !important;
    }

    .day-3r0qUNSu.withinSelectedRange-3r0qUNSu {
      background-color: ${options.upColorCheckBoxBackground} !important;
      border-color: ${options.upColorCheckBoxBackground} !important;
      color: #ffffff !important;

    }

    .day-3r0qUNSu.currentDay-3r0qUNSu {
      color: #ffffff !important;
    }
  `
}

const TradingChartHelper = {
  getDeadPeriod,
  getGameTime,
  overrideChartCss,
  getMaxGameTime,
}

export default TradingChartHelper
