/**
 * TradeBox panel styles
 */
import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../core/utils'
import { Colors } from '../../models/color'

const Wrapper = styled.div<any>`
  width: ${(props) => (props.isMobile ? '100%' : '310px')};
  padding: ${(props) => (props.isMobile ? '10px 20px 20px 20px' : '10px')};
  box-sizing: border-box;
  background-color: ${(props) =>
    props.isMobile
      ? props.colors.tradebox.widgetBackground
      : props.colors.backgroundDefault};

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            width: 180px !important;
            padding: 9px !important;
            background-color: #1d2834 !important;
            height: ${window.innerHeight}px;
            overflow: auto;
            -ms-overflow-style: none;
            scrollbar-width: none;
            &::-webkit-scrollbar {
              display: none;
            }
          }
        `
      : css``}
`

const Panel = styled.div<{
  colors: any
  isMobile?: boolean
  hidePanel?: boolean
}>`
  position: relative;
  display: block;
  box-sizing: border-box;

  ${(props) =>
    props.hidePanel
      ? css`
          width: 0 !important;
        `
      : css`
          min-width: 270px;
        `}

  &.trade-box-desktop, &.trade-box-mobile {
    ${(props) =>
      props.hidePanel
        ? css`
            padding: 0 !important;
          `
        : css`
            padding: 16px;
          `}
  }

  border-radius: 3px;
  background-color: ${(props) => props.colors.backgroundHue1};

  ${(props) =>
    props.isMobile && !isMobileLandscape(props.isMobile)
      ? css``
      : css`
          border-left: 1px solid ${props.colors.backgroundHue3};
        `}

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            min-width: unset;
            width: 270px;
            height: 100vh;
          }
        `
      : css``}

  &.trade-box-mobile {
    .investment-input {
      ${(props) =>
        props.isMobile && isMobileLandscape(props.isMobile)
          ? css`
              @media (orientation: landscape) {
                justify-content: center;
              }
            `
          : css``}
      .amount-input-mobile {
        ${(props) =>
          props.isMobile && isMobileLandscape(props.isMobile)
            ? css`
                @media (orientation: landscape) {
                  width: 1px !important;
                }
              `
            : css`
                width: unset !important;
              `}
        flex: 1 !important;
      }
    }
  }

  .d-flex {
    display: flex;
    flex-direction: row;
  }
`
const Label = styled.span<{ colors: any; top: number }>`
  display: block;
  margin-top: ${(props) => props.top}px;
  height: 14px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.1px;
  color: ${(props) => props.colors.sidebarLabelText};

  div {
    display: inline-block;
    margin-left: 10px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1px;

    color: ${(props) => props.colors.accentDefault};
  }
  svg,
  img {
    vertical-align: middle;
    margin-left: 5px;
    width: 14px;
    height: 14px;
  }
`
const PotentialProfit = styled.div<{ colors: any }>`
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 35px;
  line-height: 35px;
  border-radius: 3px;
  background-color: ${(props) => props.colors.tradebox.expiryBackground};
  color: ${(props) => props.colors.accentDefault};

  h2 {
    height: 28px;
    flex: 1 1 auto;
    text-align: right;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 6px;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 0.2px;
  }
  h3 {
    height: 28px;
    flex: 1 1 auto;
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 6px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1px;
  }
`

const PayoutLabel = styled.div<{ colors: any; isMobile: boolean }>`
  display: block;
  height: 14px;
  text-align: center;
  margin: 60px auto 0 auto;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1px;
  color: ${(props) => props.colors.accentDefault};

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            margin: 20px auto 0 auto;
          }
        `
      : css``}

  span {
    cursor: pointer;
  }

  svg,
  img {
    margin-left: 7px;
    vertical-align: middle;
  }
`

const CreateTradeButton = styled.div<{
  disabled: boolean
  colors: any
  isMobile: boolean
}>`
  display: block;
  margin-top: ${(props) => (isMobileLandscape(props.isMobile) ? 10 : 20)}px;
  height: 42px;
  line-height: 42px;
  border-radius: 4px;

  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.09px;
  text-align: center;
  text-transform: uppercase;
  user-select: none;

  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  color: ${(props) =>
    props.disabled ? props.colors.btnDisabledText : props.colors.btnNormalText};
  background: ${(props) =>
    props.disabled
      ? props.colors.tradebox.btnDisabled
      : props.colors.tradebox.btnNormal};

  &:hover {
    color: ${(props) => (props.disabled ? '' : props.colors.primaryText)};
    background: ${(props) =>
      props.disabled ? '' : props.colors.tradebox.highHover};
  }
`

const TradeButtonPlaceHolder = styled.div<{ colors: any; isMobile: boolean }>`
  display: block;
  margin-top: ${(props) => (isMobileLandscape(props.isMobile) ? 10 : 20)}px;
  height: 42px;
  line-height: 42px;
  border-radius: 4px;
  border: 2px dashed #979797;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  text-transform: uppercase;
  user-select: none;
  color: ${(props) => props.colors.secondaryText};
  background: transparent;
`

const MobileDirectionPanels = styled.div<any>`
  display: flex;
  div {
    flex: 1;
    ${(props) =>
      isMobileLandscape(props.isMobile)
        ? css`
            flex-wrap: wrap;
            align-items: center;
          `
        : css``}
    &:first-of-type {
      margin-right: 10px;
    }
  }
`
const PayoutInformationPanel = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: column;
  z-index: 41;
  position: relative;
  left: -365px;
  top: -60px;
  width: 322px;
  padding: 10px;
  border-radius: 2px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props) => props.colors.modalBackground};

  &:after {
    content: '';
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%);
    background-color: ${(props) => props.colors.modalBackground};
    position: absolute;
    z-index: 1000;
    width: 36px;
    height: 36px;
    right: -18px;
    top: 35px;
  }
`

const MobilePayoutInformationPanel = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  border-radius: 2px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props) => props.colors.modalBackground};
  z-index: 9999;
  padding: 0 8px;
`
const MobileDisableTradeTooltip = styled.div<{ colors: any }>`
  display: flex;
  text-align: center;
  margin-top: 10px;
  margin-bottom: -10px;
  color: ${(props) => props.colors.secondaryText};
`

const TradeboxSLTP = styled.div<any>`
  .sltp-row {
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    color: ${(props) => props.colors.defaultText};
    font-size: 12px;
    font-weight: 500;

    > div:first-child,
    > div:last-child {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > span {
        color: ${(props) => props.colors.defaultText};
      }
    }
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
  }

  input.currency-input {
    border: 0px;
    outline: none;
    font-size: 16px;
    color: ${(props) => props.colors.secondaryText};
    width: 100%;
    background-color: ${(props) => props.colors.fieldBackground};
    padding: 8px;
    border-radius: 4px;
    text-align: center;
    border: 1px solid transparent;
    opacity: 1;

    &.disable-input {
      color: ${(props) => props.colors.defaultText};
    }

    &.hidden-input {
      display: none;
    }

    &.field-active {
      border-color: ${(props) => props.colors.accentDefault};
    }
  }
`

const LineExpand = styled.div<{
  colors: any
  hidePanel: boolean
  isMobile: boolean
  isLoggedIn: boolean
}>`
  height: 30px;
  padding: 4px;
  background-color: ${(props) => props.colors.backgroundHue3};
  border: 1px solid ${(props) => props.colors.backgroundHue3};
  position: fixed;
  display: flex;
  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          top: calc((100vh - 20px) / 2);
        `
      : css`
          top: ${props.isLoggedIn ? 505 : 452}px;
        `};

  ${(props) =>
    props.hidePanel
      ? css`
          right: 3px;
        `
      : css`
          right: 255px;
        `};
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  cursor: pointer;
  z-index: 2;
  transform: rotate(270deg);
  width: 30px;

  &:hover {
    border-color: ${(props) => props.colors.primaryText};
  }
`

const LineExpandIcon = styled.div<{ expanded: boolean; colors: any }>`
  color: ${(props) => props.colors.primaryText};
  width: 100%;
  font-size: 13px;
  line-height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    position: absolute;
    left: 8px;
    top: 9px;
    font-size: 20px;

    &:first-child {
      transform: rotate(180deg);
      top: 3.5px;
    }
  }
`

export {
  Panel,
  Wrapper,
  Label,
  CreateTradeButton,
  PotentialProfit,
  MobileDirectionPanels,
  PayoutLabel,
  PayoutInformationPanel,
  TradeButtonPlaceHolder,
  MobilePayoutInformationPanel,
  MobileDisableTradeTooltip,
  TradeboxSLTP,
  LineExpand,
  LineExpandIcon,
}
