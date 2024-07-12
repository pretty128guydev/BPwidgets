import styled, { css } from 'styled-components'
import expand from './arrow-expand.svg'
import collapse from './arrow-collapse.svg'

const PositionsListPanel = styled.div`
  display: block;
  padding-left: 10px;
  box-sizing: border-box;
`

const PositionItemPanel = styled.span<{
  colors: any
}>`
  position: relative;
  display: block;
  box-sizing: border-box;
  padding: 15px;
  border-bottom: ${(props) => `1px solid ${props.colors.sidebarBorder}`};

  .position-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon-instrument-name-wrapper {
      display: flex;
      align-items: center;
    }
  }

  .instrument-name {
    font-size: 16px;
    font-weight: 400;
    color: ${(props) => props.colors.primaryText};
  }

  .img-asset {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    margin-right: 8px;
  }

  .buy-row {
    margin-top: 10px;

    .high-color {
      color: ${(props) => props.colors.tradebox.highText};
      flex: 1;

      .icon-arrow-down {
        display: inline-block;
        transform: rotate(180deg) translateY(-3px);
        margin: 5px;
      }
    }
  }

  .sell-row {
    margin-top: 10px;

    .high-color {
      color: ${(props) => props.colors.tradebox.lowText};
      flex: 1;

      .icon-arrow-down {
        display: inline-block;
        transform: translateY(-1px);
        margin: 5px;
      }
    }
  }

  .up-color {
    flex: 1;
    color: ${(props) => props.colors.tradebox.highText};
  }

  .down-color {
    flex: 1;
    color: ${(props) => props.colors.tradebox.lowText};
  }

  .button-close-wrapper {
    margin-top: 15px;
    display: flex;
  }
`

const ShortPositionPanel = styled.div<any>`
  display: flex;
  width: 100%;
  height: 50px;
  box-sizing: border-box;

  position: relative;
  background-color: ${(props) =>
    props.opened ? props.colors.accentDefault : props.colors.backgroundDefault};

  img {
    margin: 5px 0 0 10px;
    width: 26px;
    height: 26px;
  }
`

const OpenPositionPanel = styled.div<any>`
  box-sizing: border-box;
  position: relative;

  .trade-detail {
    margin: 20px 20px 0 20px;

    .line {
      display: flex;

      div {
        flex: 1;
        font-size: 12px;
        line-height: 1.42;
        letter-spacing: 0.01px;
        color: #646e79;
      }
      span {
        flex: 1;
        font-size: 12px;
        line-height: 1.42;
        letter-spacing: 0.01px;
        color: ${(props) => props.colors.primaryText};
      }
    }
  }

  .trade_line {
    display: flex;
    height: 28px;
    margin-top: 18px;
    margin-bottom: 21px;

    div:nth-child(1) {
      flex: 1 0 178px;
    }

    div:nth-child(2) {
      flex: 0 1 30%;
    }

    div:nth-child(3) {
      flex: 0 1 30%;
    }
  }

  .direction-row {
    display: flex;
    text-transform: uppercase;
    align-items: flex-end;

    .icon-arrow-down {
      margin-left: 10px;
      margin-right: 5px;
      font-size: 40px;
      line-height: 20px;
    }
  }

  .direction-row.down-color .icon-arrow-down {
    transform: translateY(-2px);
  }

  .direction-row.up-color .icon-arrow-down {
    transform: translateY(3px) rotate(180deg);
  }
`

const ClosedPositionPanel = styled.div<any>`
  box-sizing: border-box;
  position: relative;
  display: flex;

  .left-panel {
    flex: 1;

    .left-panel-item {
      display: flex;

      > div:first-child {
        flex: 1;
        font-size: 12px;
        line-height: 1.42;
        letter-spacing: 0.01px;
        color: #646e79;

        &.icon-instrument-name-wrapper {
          display: flex;
          align-items: center;
        }
      }

      > div:last-child {
        flex: 1;
        font-size: 12px;
        line-height: 1.42;
        letter-spacing: 0.01px;
        color: ${(props) => props.colors.primaryText};
      }

      .buy-row,
      .sell-row {
        display: flex;
        margin-top: 0;
        align-items: center;

        .icon-arrow-down {
          margin-left: 0;
        }
      }

      .buy-row .icon-arrow-down {
        transform: rotate(180deg);
      }
    }

    .direction-row {
      .icon-arrow-down {
        margin-left: 10px;
      }
    }

    .direction-row.up-color .icon-arrow-down {
      transform: rotate(180deg);
    }
  }
`

const TradeInfo = styled.div<{}>`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`

const TradeDetails = styled.div<{ colors: any }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 6px;

  .trade__asset_name {
    font-size: 11px;
    letter-spacing: 0.09px;
    color: ${(props) => props.colors.primaryText};
  }
  .trade__direction {
    font-size: 10px;
    letter-spacing: 0.01px;
    color: #66707a;
    text-transform: uppercase;
  }
  .trade__money {
    font-size: 10px;
    letter-spacing: 0.01px;
  }
`

const TradeInfoExpander = styled.div<{ colors: any; opened: boolean }>`
  width: 28px;
  height: 100%;
  border-left: 1px solid ${(props) => props.colors.backgroundHue3};
  margin-left: 10px;
  background: url(${(props) => (props.opened ? collapse : expand)}) no-repeat
    center;
  cursor: pointer;
`

const ExpandButton = styled.div<any>`
  display: block;
  width: 20px;
  height: 10px;
  position: absolute;
  bottom: 5px;
  left: calc(50% - 10px);
  cursor: pointer;

  background: url(${expand}) no-repeat center;
  color: ${(props) => props.colors.sidebarBorder};
`

const CollapseButton = styled.div<any>`
  display: block;
  width: 20px;
  height: 10px;
  position: absolute;
  bottom: 5px;
  left: calc(50% - 10px);
  cursor: pointer;

  background: url(${collapse}) no-repeat center;
  color: ${(props) => props.colors.secondaryText};
`

const CloseButton = styled.div<{ colors: any; disabled: boolean }>`
  padding: 5px 10px;
  line-height: 13px;
  border-radius: 3px;
  border: solid 1px
    ${(props) =>
      props.disabled
        ? props.colors.secondaryText
        : props.colors.tradebox.lowActive} !important;
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) =>
    props.disabled
      ? props.colors.secondaryText
      : props.colors.tradebox.lowActive} !important;
  background-color: ${(props) =>
    props.disabled ? 'unset' : props.colors.tradebox.lowNormal};
  cursor: pointer;
  display: inline-block;
  margin-top: 10px;

  ${(props) =>
    props.disabled
      ? css`
          cursor: not-allowed;
          opacity: 0.5;
        `
      : css``}

  &:hover {
    opacity: 0.5;
  }
`

const EditSLTPButton = styled.div<{ colors: any; disabled: boolean }>`
  padding: 5px 10px;
  line-height: 13px;
  border-radius: 3px;
  border: solid 1px ${(props) => props.colors.secondaryText};
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  color: ${(props) => props.colors.secondaryText} !important;
  cursor: pointer;
  display: inline-block;
  margin-top: 10px;
  margin-right: 10px;

  ${(props) =>
    props.disabled
      ? css`
          cursor: not-allowed;
          opacity: 0.5;
        `
      : css``}

  &:hover {
    opacity: 0.5;
  }
`

const ButtonIcon = styled.div<any>`
  flex: 0 1 30%;
  text-align: right;
  margin-left: 10px;
`
const FloatingAmount = styled.span<{ color: string; closed: boolean }>`
  position: absolute;
  top: 14px;
  right: ${(props) => (props.closed ? 10 : 50)}px;
  bottom: 14px;
  font-weight: 500;
  color: ${(props) => props.color};
`

const TradeAmount = styled.div<{ color: string }>`
  display: flex;
  font-weight: 500;
  color: ${(props) => props.color};
  align-items: center;
`

const TradePnl = styled.div<{ color: any }>`
  display: flex;
  flex-direction: column;
  text-align: right;
  margin-right: 10px;
  color: ${(props) => props.color};

  .label {
    font-size: 10px;
    text-align: right;
    letter-spacing: 0.00641px;
    color: #66707a;
  }
`

const PositionOverlay = styled.div`
  position: absolute;
  z-index: 40;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
`

const ClosedPositionsScroller = styled.div<{ colors: any }>`
  display: flex;
  overflow: auto;
  flex-direction: column;

  .positions-actions {
    display: flex;
    justify-content: space-between;
    padding: 10px;

    span {
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      color: ${(props) => props.colors.primaryText};
    }

    .positions_load-more {
      font-size: 14px;
      line-height: 16px;
      text-transform: uppercase;
      cursor: pointer;
      color: ${(props) => props.colors.accentDefault};
    }
  }
`
export {
  OpenPositionPanel,
  ClosedPositionPanel,
  ShortPositionPanel,
  PositionItemPanel,
  PositionsListPanel,
  ExpandButton,
  CollapseButton,
  CloseButton,
  ButtonIcon,
  FloatingAmount,
  PositionOverlay,
  ClosedPositionsScroller,
  TradeInfo,
  TradeAmount,
  TradeDetails,
  TradeInfoExpander,
  TradePnl,
  EditSLTPButton,
}
