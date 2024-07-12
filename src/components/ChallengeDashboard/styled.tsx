import styled from 'styled-components'

const Panel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 3;
`

const PanelSideMode = styled.div<{ colors: any }>`
  width: 270px;
  height: 100%;
  position: absolute;
  padding: 8px;
  border-right: 1px solid ${(props) => props.colors.panelBorder};
  top: 0;
  left: 0;
  bottom: 0;
  background-color: ${(props) => props.colors.backgroundDefault};
  z-index: 1;
  overflow-y: auto;
`

const Wrapper = styled.div<{
  colors: any
}>`
  position: relative;
  height: calc(100% - 40px);
  padding: 10px;
  overflow-x: auto;
  background-color: ${(props) => props.colors.backgroundHue1};

  .mt-10 {
    margin-top: 10px;
  }

  .flex-2 {
    flex: 2 !important;
  }

  .buttons-group {
    position: absolute;
    top: 10px;
    right: 10px;

    .icon-mini-mode {
      margin-right: 5px;
      cursor: pointer;
    }

    .icon-close {
      cursor: pointer;
    }
  }

  .challenge-dashboard-container {
    min-width: 1600px;
    display: grid;
    grid-template-areas:
      'header header balance equity freemargin marginused profittarget drawdown drawdownlimit'
      'chart chart chart chart chart1 chart1 chart1 chart1 openpnl'
      'chart chart chart chart chart1 chart1 chart1 chart1 tradingday'
      'chart2 chart2 chart2 chart2 recenttrades recenttrades recenttrades recenttrades recenttrades';
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

    .content-container {
      margin-top: 10px;
      display: flex;
    }

    .dashboard-item-balance {
      grid-area: balance;
    }

    .dashboard-item-equity {
      grid-area: equity;
    }

    .dashboard-item-freemargin {
      grid-area: freemargin;
    }

    .dashboard-item-marginused {
      grid-area: marginused;
    }

    .dashboard-item-profittarget {
      grid-area: profittarget;
    }

    .dashboard-item-drawdown {
      grid-area: drawdown;
    }

    .dashboard-item-drawdownlimit {
      grid-area: drawdownlimit;
    }

    .dashboard-item-openpnl {
      grid-area: openpnl;
    }

    .dashboard-item-tradingday {
      grid-area: tradingday;
    }

    .dashboard-item-top-assets {
      grid-area: chart;

      .top-assets-container {
        margin-top: 20px;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 200px 0;
      }
    }

    .dashboard-item-volume-per-day {
      grid-area: chart1;

      .bar-chart-container {
        margin-top: 20px;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 200px 0;
      }
    }

    .dashboard-item-line-chart {
      grid-area: chart2;
    }

    .dashboard-item-recent-trades {
      grid-area: recenttrades;
    }

    .dashboard-item {
      background-color: ${(props) => props.colors.backgroundHue3};
      padding: 20px;
      margin: 5px;
      border-radius: 5px;

      .dashboard-item-title {
        font-size: 14px;
        line-height: 16.41px;
        font-weight: 700;
        white-space: nowrap;
        color: ${(props) => props.colors.accentHue2};
        text-transform: uppercase;
      }

      .dashboard-item-value {
        font-size: 22px;
        line-height: 25.78px;
        font-weight: 500;
        margin-top: 10px;
        white-space: nowrap;
        color: ${(props) => props.colors.accentHue1};
      }

      .dashboard-item-change {
        font-size: 14px;
        line-height: 16.41px;
        margin-top: 10px;

        span:first-child {
          margin-right: 8px;
        }
      }

      .down {
        color: ${(props) => props.colors.primaryHue1} !important;
      }

      .up {
        color: ${(props) => props.colors.accentDefault} !important;
      }
    }

    .chart-container {
      display: grid;
      grid-area: topTradedAssets;
      grid-template-columns: 1fr;
      grid-template-rows: 30px 170px;
      border-radius: 2px;
      padding: 0;

      .dashboard-item-title {
        padding: 20px 20px 0 20px;
      }
    }

    .profit-drawdown-title {
      color: ${(props) => props.colors.accentHue2};
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 16.41px;
    }

    .trading-days-value {
      font-size: 50px;
      font-weight: 700;
      margin-top: 10px;
      text-align: center;
      color: ${(props) => props.colors.accentHue2};

      > span {
        color: ${(props) => props.colors.primary};
      }
    }

    .trading-days-checked {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .un-checked {
      color: #263346;
    }

    .checked {
      color: ${(props) => props.colors.accentHue2};

      circle {
        fill: ${(props) => props.colors.accentDefault};
      }
    }
  }

  .header-challenge-dashboard {
    display: flex;
    align-items: center;
    grid-area: header;

    .title {
      font-size: 28px;
      line-height: 40px;
      color: ${(props) => props.colors.accentHue1};
      font-weight: 700;
      margin-left: 20px;
    }
  }

  .highcharts-container .highcharts-background {
    fill: transparent;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
  }

  .drawdown-risk-o-meter-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }

  .risk-o-meter-chart-container {
    display: flex;
    justify-content: center;
    padding-bottom: 8px;
    overflow-y: hidden;
    width: 260px;
  }

  .risk-o-meter-chart {
    margin-top: 20px;
    width: 240px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: relative;

    .zero-percent {
      position: absolute;
      bottom: -2px;
      left: -6px;
      font-size: 12px;
      color: ${(props) => props.colors.accentHue2};
    }

    .chart-skills {
      margin: 0 auto;
      padding: 0;
      list-style-type: none;
    }

    .chart-skills *,
    .chart-skills::before {
      box-sizing: border-box;
    }

    /* CHART-SKILLS STYLES */

    .chart-skills {
      position: relative;
      width: 87%;
      height: 87%;
    }

    .chart-skills::before,
    .chart-skills::after {
      position: absolute;
    }

    .chart-skills::before {
      content: '';
      width: 100%;
      height: 100%;
      border: 25px solid transparent;
      border-bottom: none;
      border-top-left-radius: 175px;
      border-top-right-radius: 175px;
    }

    .chart-skills li {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 100%;
      border: 25px solid;
      border-top: 1px solid ${(props) => props.colors.backgroundHue3} !important;
      border-bottom-left-radius: 175px;
      border-bottom-right-radius: 175px;
      transform-origin: 50% 0;
      transform-style: preserve-3d;
      backface-visibility: hidden;
      animation-fill-mode: forwards;
      animation-duration: 0.1s;
      animation-timing-function: linear;
    }

    .chart-skills li:nth-child(1) {
      z-index: 5;
      border-color: rgba(117, 249, 134, 1);
      animation-name: rotate-one;
    }

    .chart-skills li:nth-child(2) {
      z-index: 4;
      border-color: rgba(186, 227, 67, 1);
      animation-name: rotate-two;
      animation-delay: 0.1s;
    }

    .chart-skills li:nth-child(3) {
      z-index: 3;
      border-color: rgba(255, 204, 0, 1);
      animation-name: rotate-three;
      animation-delay: 0.2s;
    }

    .chart-skills li:nth-child(4) {
      z-index: 2;
      border-color: rgba(255, 102, 49, 1);
      animation-name: rotate-four;
      animation-delay: 0.3s;
    }

    .chart-skills li:nth-child(5) {
      z-index: 1;
      border-color: rgba(255, 0, 98, 1);
      animation-name: rotate-five;
      animation-delay: 0.4s;
    }

    .chart-skills span {
      position: absolute;
      font-size: 12px;
      backface-visibility: hidden;
      animation: fade-in 0.2s linear forwards;
      color: ${(props) => props.colors.accentHue2};
    }

    .chart-skills li:nth-child(1) span {
      top: -10px;
      left: -50px;
      transform: rotate(-36deg);
    }

    .chart-skills li:nth-child(2) span {
      top: -10px;
      left: -45px;
      transform: rotate(-72deg);
      animation-delay: 0.1s;
    }

    .chart-skills li:nth-child(3) span {
      top: -10px;
      left: -45px;
      transform: rotate(-106deg);
      animation-delay: 0.2s;
    }

    .chart-skills li:nth-child(4) span {
      top: -10px;
      left: -50px;
      transform: rotate(-144deg);
      animation-delay: 0.3s;
    }

    .chart-skills li:nth-child(5) span {
      top: -2px;
      left: -50px;
      transform: rotate(-180deg);
      animation-delay: 0.4s;
    }

    /* ANIMATIONS */

    @keyframes rotate-one {
      100% {
        transform: rotate(36deg);
      }
    }

    @keyframes rotate-two {
      0% {
        transform: rotate(36deg);
      }
      100% {
        transform: rotate(72deg);
      }
    }

    @keyframes rotate-three {
      0% {
        transform: rotate(72deg);
      }
      100% {
        transform: rotate(108deg);
      }
    }

    @keyframes rotate-four {
      0% {
        transform: rotate(108deg);
      }
      100% {
        transform: rotate(144deg);
      }
    }

    @keyframes rotate-five {
      0% {
        transform: rotate(144deg);
      }
      100% {
        transform: rotate(180deg);
      }
    }

    @keyframes fade-in {
      0%,
      90% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    .semi-cycle {
      border-radius: 12rem 12rem 0 0;
      background: linear-gradient(
          36deg,
          rgba(117, 249, 134, 0.4),
          rgba(117, 249, 134, 0) 70.71%
        ),
        linear-gradient(
          72deg,
          rgba(186, 227, 67, 0.4),
          rgba(186, 227, 67, 0) 70.71%
        ),
        linear-gradient(
          108deg,
          rgba(255, 204, 0, 0.4),
          rgba(255, 204, 0, 0) 70.71%
        ),
        linear-gradient(
          144deg,
          rgba(255, 102, 49, 0.4),
          rgba(255, 102, 49, 0) 70.71%
        ),
        linear-gradient(
          180deg,
          rgba(255, 0, 98, 0.4),
          rgba(255, 0, 98, 0.2) 70.71%
        );
      position: absolute;
      left: 46px;
      right: 46px;
      top: 46px;
      bottom: 0px;
      z-index: 6;
    }

    .position-relative {
      position: relative;
    }

    .clockwise-container {
      position: absolute;
      bottom: -15px;
      left: 0px;
      right: 0px;
      z-index: 6;
      height: 16px;
      background: ${(props) => props.colors.backgroundHue3};
    }

    .clockwise {
      position: absolute;
      top: -4px;
      left: 25px;
      width: 0;
      height: 0;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      border-right: 90px solid white;
    }

    .clockwise-dot {
      position: absolute;
      top: -9px;
      left: 110px;
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 8px;
      background-color: white;
    }
  }

  .low-high-risk {
    display: flex;
    justify-content: space-between;
    text-transform: uppercase;
    padding: 0 30px;

    .low-risk {
      color: rgba(117, 249, 134, 1);
      font-size: 14px;
      font-weight: 700;
    }

    .high-risk {
      color: rgba(255, 0, 98, 1);
      font-size: 14px;
      font-weight: 700;
    }
  }

  .check-mark-checked {
    cycle {
      fill: ${(props) => props.colors.accentDefault};
    }
  }
`

const ChallengeDashboardItem = styled.div<{
  colors: any
  padding?: number
}>`
  border-radius: 4px;
  padding: ${(props) => (props.padding !== undefined ? props.padding : 8)}px;
  background-color: ${(props) => props.colors.backgroundHue3};
  margin-bottom: 8px;

  &.group {
    display: flex;
    background-color: transparent;

    .group-item {
      flex: 1;
      background-color: ${(props) => props.colors.backgroundHue3};
      padding: 8px;
      border-radius: 4px;

      &:first-child {
        margin-right: 4px;
      }
      &:last-child {
        margin-left: 4px;
      }

      .group-item-title {
        color: ${(props) => props.colors.accentHue2};
        font-size: 12px;
        font-weight: 700;
        line-height: 14.06px;
        text-transform: uppercase;
      }

      .group-item-value {
        color: ${(props) => props.colors.accentHue1};
        font-size: 16px;
        font-weight: 500;
        line-height: 18.75px;
        margin-top: 5px;
        white-space: nowrap;
      }

      .group-item-change {
        font-size: 14px;
        font-weight: 500;
        line-height: 16.41px;
        margin-top: 5px;

        span:first-child {
          margin-right: 8px;
        }

        &.down {
          color: ${(props) => props.colors.primaryHue1} !important;
        }

        &.up {
          color: ${(props) => props.colors.primaryDefault} !important;
        }
      }
    }
  }

  .evaluation-title {
    color: ${(props) => props.colors.accentDefault};
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 16.41px;
    margin-bottom: 3px;
  }

  .evaluation-container {
    display: flex;
    justify-content: space-between;
    margin-top: 3px;

    .evaluation-text {
      color: ${(props) => props.colors.accentHue2};
      font-size: 14px;
      font-weight: 400;
      line-height: 16.41px;
    }

    .evaluation-value {
      color: ${(props) => props.colors.accentDefault};
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      line-height: 16.41px;
    }
  }

  .profit-drawdown-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > span:first-child {
      color: ${(props) => props.colors.accentHue2};
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 16.41px;
    }

    > span:last-child {
      display: flex;
      align-items: center;
      white-space: nowrap;

      > span:first-child {
        margin-right: 5px;
      }
    }

    .un-checked {
      color: #263346;
    }

    .checked {
      color: ${(props) => props.colors.accentHue2};

      circle {
        fill: ${(props) => props.colors.accentDefault};
      }
    }

    .checked-red {
      color: ${(props) => props.colors.accentHue2};

      circle {
        fill: ${(props) => props.colors.primaryHue1};
      }
    }
  }

  .profit-drawdown-value {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 20px;
    font-weight: 700;
    margin-top: 20px;

    span {
      &.down {
        color: ${(props) => props.colors.primaryHue1} !important;
      }

      &.up {
        color: ${(props) => props.colors.accentDefault} !important;
      }
    }

    span:last-child {
      color: ${(props) => props.colors.accentHue1};
    }
  }

  .trading-days-value {
    font-size: 40px;
    font-weight: 700;
    margin-top: 20px;
    text-align: center;
    color: ${(props) => props.colors.accentHue2};

    > span {
      color: ${(props) => props.colors.primary};
    }
  }

  .red-color {
    color: ${(props) => props.colors.primaryHue1} !important;
  }
`

export { Panel, PanelSideMode, Wrapper, ChallengeDashboardItem }
