import styled from 'styled-components'

const DashboardRecentTradesSpace = styled.div<{
  colors: any
  isMobile: boolean
}>`
  ${(props) => (props.isMobile ? '' : 'grid-area: recentTrades')};
  display: grid;
  grid-template-columns: 1fr;
  border-radius: 2px;
  background-color: ${(props) => props.colors.backgroundHue3};
`

const RecentTradesTableSpace = styled.table`
  width: 100%;
  max-height: 100%;
  padding: 0 12px 0 12px;
  border-spacing: 0;
`

const RecentTradesListSpace = styled.div`
  width: calc(100% - 24px);
  max-height: 100%;
  margin: 0 10px 0 10px;
  padding: 2px;
  border-spacing: 0;
  overflow: auto;
`

const RecentTradesTableTHead = styled.thead`
  display: table;
  table-layout: fixed;
  width: 100%;
  padding-right: 8px;
`

const RecentTradesTableTBody = styled.tbody`
  display: block;
  height: 187px;
  overflow: auto;
`

const RecentTradesTableRow = styled.tr`
  display: table;
  table-layout: fixed;
  width: 100%;
`

const RecentTradesTableHeader = styled.th<{
  colors: any
  widthPercent: number
}>`
  font-style: normal;
  font-weight: 900;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.2px;
  text-transform: uppercase;
  padding: 0 0 8px 0;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${(props) => `${props.widthPercent}%`};
  color: ${(props) => props.colors.secondaryText};
  border-bottom: 1px solid ${(props) => props.colors.backgroundHue3};

  span {
    display: initial;
    position: relative;
    height: 100%;
    padding: 9px 8px;
  }

  &:hover {
    position: relative;
    overflow: visible;
    z-index: 1;

    span:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: ${(props) => props.colors.modalBackground};
      z-index: -1;
    }
  }

  &.text-center {
    text-align: center;
  }
`

const RecentTradesTableColumn = styled.td<{
  colors: any
  widthPercent: number
  alignRight?: boolean
  minWidth: number
}>`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 30px;
  letter-spacing: -0.2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: ${(props) => (props.alignRight ? 'right' : 'left')};
  color: ${(props) => props.colors.defaultText};
  border-bottom: 1px solid ${(props) => props.colors.backgroundHue3};
  width: ${(props) => `${props.widthPercent}%`};
  min-width: ${(props) => `${props.minWidth}px`};

  span {
    display: initial;
    position: relative;
    height: 100%;
    padding: 9px 8px;
  }

  &:hover {
    position: relative;
    overflow: visible;
    z-index: 1;

    span:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: ${(props) => props.colors.modalBackground};
      z-index: -1;
    }
  }

  .high-color {
    color: ${(props) => props.colors.tradebox.highText};

    .icon-arrow-down {
      display: inline-block;
      transform: rotate(180deg) translateY(-5px);
      font-size: 20px;
      line-height: 0;
      padding: 9px 3px;
    }
  }

  .low-color {
    color: ${(props) => props.colors.tradebox.lowText};

    .icon-arrow-down {
      display: inline-block;
      transform: translateY(1px);
      font-size: 20px;
      line-height: 0;
      padding: 9px 3px;
    }
  }

  &.text-center {
    text-align: center;
  }
`

const RecentTradesDownload = styled.button<{
  colors: any
}>`
  color: ${(props) => props.colors.accentDefault};
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export {
  DashboardRecentTradesSpace,
  RecentTradesTableSpace,
  RecentTradesTableRow,
  RecentTradesTableHeader,
  RecentTradesTableColumn,
  RecentTradesTableTHead,
  RecentTradesTableTBody,
  RecentTradesDownload,
  RecentTradesListSpace,
}
