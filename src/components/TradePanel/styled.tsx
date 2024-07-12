import styled from 'styled-components'
import { Colors } from '../../models/color'

const BottomPositionPanel = styled.div<{ colors: any }>`
  padding-bottom: 15px;

  .table-wrap {
    overflow: auto;
    padding-left: 15px;
    width: 100%;
  }
`

const HeaderTrade = styled.div<{ colors: any }>`
  display: flex;
  justify-content: space-between;
  padding: 0 20px 10px;

  .title-panel {
    color: ${(props) => props.colors.secondaryText};
    font-size: 15px;
    font-weight: 500;
    padding-left: 10px;
  }

  .group-button {
    padding-top: 10px;

    button {
      background-color: transparent;
      border-radius: 5px;
      font-weight: 400;
      font-size: 13px;
      text-transform: capitalize;
      color: ${(props) => props.colors.defaultText};
      ouline: none !important;
      letter-spacing: 0.2px;

      &.active {
        background-color: ${(props) => props.colors.backgroundHue3};
        color: ${(props) => props.colors.secondaryText};
      }

      &:hover:not(.active),
      &:active:not(.active),
      &:focus:not(.active) {
        background: transparent !important;

        &::before {
          background: transparent !important;
        }
      }
    }
  }
`

const TradeTable = styled.table<{ colors: any }>`
  width: 100%;
  // tbody {
  //   display: block;
  //   overflow: auto;
  // }

  // thead,
  // tbody tr {
  //   display: table;
  //   width: 100%;
  //   table-layout: fixed;
  // }

  // thead {
  //   width: calc(100% - 8px);
  // }

  thead tr th {
    position: sticky;
    top: 0;
    padding-top: 0;
    background-color: ${(props) => props.colors.backgroundHue1};
    z-index: 1;
  }

  th,
  td {
    border: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
    color: ${(props) => props.colors.secondaryText};
    padding-right: 10px;

    .close-button {
      background: ${(props) => props.colors.backgroundHue3};
      color: ${(props) => props.colors.primaryText};
      border: 1px solid;
      border-color: ${(props) => props.colors.primaryText};
      border-radius: 3px;
      font-size: 11px;
      padding-right: 10px;
      padding-left: 10px;
      font-weight: 600;
      min-height: 25px;
      max-height: 25px;
      letter-spacing: 0.2px;
      text-transform: uppercase;
    }
  }

  th {
    font-size: 12px;
    padding-bottom: 15px;
    text-transform: uppercase;
    font-weight: 600;
  }

  td {
    font-size: 14px;
    padding-bottom: 3px;
    padding-top: 3px;
    font-weight: 400;
  }

  tr {
    border-bottom: 1px solid #273346;

    .icon-arrow-down {
      font-size: 24px;
    }

    .high-color {
      display: flex;
      align-items: center;
    }

    &.buy-row {
      .high-color {
        color: ${(props) => props.colors.tradebox.highText};

        .icon-arrow-down {
          transform: rotate(180deg) translateY(-3px);
          margin-right: 5px;
        }
      }
    }

    &.sell-row {
      .high-color {
        color: ${(props) => props.colors.tradebox.lowText};

        .icon-arrow-down {
          transform: translateY(-1px);
          margin-right: 5px;
        }
      }
    }

    .up-color {
      color: ${(props) => props.colors.tradebox.highText};
    }

    .down-color {
      color: ${(props) => props.colors.tradebox.lowText};
    }

    .amount-group {
      display: flex;
      justify-content: flex-start;

      > span {
        margin-right: 8px;
      }

      > div {
        cursor: pointer;
      }
    }
  }

  .fit-content {
    width: 1px;
    white-space: nowrap;
  }
`

const LineExpandWraper = styled.div<{ colors: any }>`
  height: 5px;
  background-color: ${(props) => props.colors.tradebox.background};
  display: flex;
  justify-content: space-around;
  align-items: center;
  cursor: ns-resize;
  z-index: 2;
`

const LineExpand = styled.div<{ colors: any }>`
  display: flex;
  padding: 4px 10px 4px 25px;
  margin-bottom: 4px;
  background-color: ${(props) => props.colors.backgroundHue3};
  border: 1px solid ${(props) => props.colors.backgroundHue3};
  position: relative;
  align-items: center;
  justify-content: space-around;
  border-radius: 50px;
  cursor: pointer;
  z-index: 2;
`

const LineExpandIcon = styled.div<{ expanded: boolean; colors: any }>`
  color: ${(props) => props.colors.defaultText};
  width: 100%;
  font-size: 13px;

  > .icon-move {
    position: absolute;
    left: 10px;
    top: 4.7px;
    font-size: 16px;

    &:first-child {
      transform: rotate(180deg);
      top: 1px;
    }
  }

  .counter-container {
    display: inline-block;
  }
`

export {
  BottomPositionPanel,
  HeaderTrade,
  TradeTable,
  LineExpand,
  LineExpandWraper,
  LineExpandIcon,
}
