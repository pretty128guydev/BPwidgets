import styled from 'styled-components'

const DashboardCardWrapper = styled.div<{
  colors: any
}>`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.colors.backgroundHue3};
  border-radius: 2px;
  padding: 15px 20px;
  overflow: auto;
  justify-content: space-between;
`

const DashboardCardTitle = styled.div<{
  colors: any
  bottomBorder?: boolean
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 20px;
  color: ${(props) => props.colors.secondaryText};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.0941177px;

  ${(props) =>
    props.bottomBorder
      ? `border-bottom: 1px solid ${props.colors.backgroundHue3}`
      : ''};
`

const DashboardCardFooter = styled.button<{
  colors: any
}>`
  color: ${(props) => props.colors.primaryText};
  background: none;
  border: none;
  cursor: pointer;
  width: max-content;
  padding: 0 20px;
  justify-self: end;

  &:hover {
    text-decoration: underline;
  }
`

const DashboardCardName = styled.div<{
  colors: any
}>`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: -0.233333px;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => props.colors.defaultText};
`

const DashboardCardValue = styled.div<{
  color: any
  colors?: any
}>`
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  line-height: 26px;
  text-transform: uppercase;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => props.color};

  &.high-color {
    color: ${(props) => props.colors?.tradebox?.highText};
  }

  &.low-color {
    color: ${(props) => props.colors?.tradebox?.lowText};
  }
`

const DashboardWrapper = styled.div<{
  colors: any
  isMobile: boolean
}>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.isMobile
      ? 'repeat(auto-fit, calc(100vw - 16px))'
      : '1fr 1fr 1fr 1fr 1fr 1fr'};
  grid-template-rows: ${(props) =>
    props.isMobile ? 'auto' : 'min-content 244px 300px'};
  column-gap: 10px;
  row-gap: 10px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;

  ${(props) =>
    props.isMobile
      ? ''
      : "grid-template-areas: 'cash cash cash bonus bonus bonus' 'topTradedAssets topTradedAssets tradeVolume tradeVolume tradeVolume tradeVolume''recentUpdates recentUpdates recentTrades recentTrades recentTrades recentTrades'"};

  overflow: auto;
  width: 100%;
  padding: ${(props) =>
    props.isMobile ? '0 8px 8px 8px' : '20px 35px 20px 20px'};
  ${(props) => (props.isMobile ? 'margin-top: 50px' : '')};
  background-color: ${(props) => props.colors.backgroundHue1};

  .highcharts-container .highcharts-background {
    fill: transparent;
  }
`

export {
  DashboardWrapper,
  DashboardCardName,
  DashboardCardValue,
  DashboardCardWrapper,
  DashboardCardTitle,
  DashboardCardFooter,
}
