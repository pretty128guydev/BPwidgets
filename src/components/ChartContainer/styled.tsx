/**
 * Gather all styled UI components
 */
import styled from 'styled-components'
import { ListContainer, ListItem } from '../ui/List'

const ControlsPanel = styled.span`
  z-index: 30;
  display: flex;
  flex-direction: row;
`
const SecondaryPanel = styled.div`
  position: absolute;
  max-width: 280px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  top: 40px;
  left: 235px;
  right: 0;
  height: 16px;

  font-size: 14px;
  letter-spacing: -0.08px;
  color: #ffffff;
  font-weight: 500;
`

const PrimaryBlock = styled.div`
  flex: 1 1 auto;
  display: flex;
  align-items: center;

  &:after {
    content: ' ';
    clear: both;
  }
`
const PrimaryBlockHight = styled.div`
  flex: 1 1 auto;k
  display: flex;
  align-items: center;
  height: 40px;
  &:after {
    content: ' ';
    clear: both;
  }
`
const PrimaryHolder = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  text-align: left;
  line-height: 30px;
`

const FavIconHolder = styled.div`
  padding: 6px 0 0 3px;
  img {
    padding: unset !important;
  }
`

const ButtonsHolder = styled.div`
  display: inline-flex;
  align-items: center;
`

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 4px;
`

const LastPrice = styled.span<{ colors: any }>`
  display: inline-block;
  height: 30px;
  line-height: 30px;

  padding-left: 15px;
  margin-right: 19px;
  font-size: 24px;
  font-weight: 500;
  letter-spacing: normal;

  color: ${(props) => props.colors.accentDefault};
`
const ChartButton = styled.button<{
  smallText?: boolean
  colors: any
  indicators?: any
  isMobile: boolean
  isTradingView?: boolean
  index?: number
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  height: 30px;
  width: 30px;
  line-height: 28px;
  margin: 0 5px;
  outline: none;
  border: none;
  border-radius: 15px;
  font-size: ${(props) => (props.smallText ? '9' : '12')}px;
  font-weight: 500;
  letter-spacing: 0.1px;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;

  color: ${(props) => props.colors.primaryText};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  background-color: ${(props) => props.colors.backgroundHue3};

  &.resolution-button {
    width: auto !important;
  }

  .switch-chart-view-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: ${(props) => props.colors.backgroundHue3} 0 5px;
    color: #fff;
  }
`
const ChartButtonBottomPanel = styled(ChartButton)`
  margin: 0 5px;
  padding: 0 7px;
`

const IndicatorsButton = styled(ChartButton)`
  position: relative;
  min-width: ${(props) => (props.isMobile ? 'unset' : '124px')};
  width: ${(props) => (props.indicators && !props.isMobile ? '150px' : 'auto')};
  text-align: left;
  border-radius: 15px;

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
  }

  svg {
    display: inline-block;
    vertical-align: sub;
    margin-left: 4px;
    margin-right: 4px;
  }

  .btn__caption {
    display: inline-block;

    font-size: 12px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: normal;
    color: ${(props) => props.colors.primaryText};
  }

  .enabled__indicators {
    position: absolute;
    top: 0;
    right: 0;
    display: block;

    width: 36px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: normal;
    cursor: pointer;

    color: #000000;
    background: ${(props) => (props.isMobile ? '0px 0px' : '0px 5px')};
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }
`

const TooltipContainer = styled.div`
  display: flex;
  width: 340px;
  white-space: nowrap;
`

const TooltipColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  max-width: 50%;
  max-height: 100%;
  box-sizing: border-box;
`

const TooltipTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`

const TooltipDataCell = styled.div``

const IndicatorsWrapper = styled.div<{ colors: any }>`
  display: inline-block;
`

const IndicatorWarning = styled.div`
  max-width: 186px;
`

const WarningContent = styled.div`
  line-height: normal;
  margin-bottom: 14px;
`

const SwithButton = styled.div<{ colors: any }>`
  flex: 1 0 178px;
  height: 28px;
  max-width: 92px;
  line-height: 28px;
  border-radius: 5px;
  border: solid 1px ${(props) => props.colors.accentDefault};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.07px;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) => props.colors.accentDefault};
`

const MobileTimeFrames = styled.div<{ colors: any }>`
  display: flex;
  justify-content: space-around;
  height: 40px;
  padding: 10px;
`

const TimeFrameItem = styled.span<{ colors: any; active: boolean }>`
  font-family: Roboto, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: ${(props) =>
    props.active ? props.colors.primaryText : props.colors.textfieldText};
  ${(props) =>
    props.active
      ? `border-bottom: 2px solid ${props.colors.accentDefault}`
      : ''};
  margin: 0 10px -3px 10px;
  line-height: 20px;
  cursor: pointer;

  &:nth-of-type(5),
  &:nth-of-type(6),
  &:nth-of-type(7),
  &:nth-of-type(8) {
    text-transform: uppercase;
  }
`

const PlotLineLabel = styled.div`
  position: absolute;
  top: -40px;
  transform: rotate(90deg);
`

export {
  ChartButton,
  ChartButtonBottomPanel,
  IndicatorsButton,
  LastPrice,
  InfoWrapper,
  PrimaryHolder,
  ButtonsHolder,
  PrimaryBlock,
  ControlsPanel,
  ListContainer,
  ListItem,
  SecondaryPanel,
  TooltipContainer,
  TooltipColumn,
  TooltipDataCell,
  TooltipTitle,
  IndicatorsWrapper,
  IndicatorWarning,
  WarningContent,
  SwithButton,
  MobileTimeFrames,
  TimeFrameItem,
  PlotLineLabel,
  FavIconHolder,
  PrimaryBlockHight,
}
