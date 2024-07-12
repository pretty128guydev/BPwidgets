import styled from 'styled-components'

const Panel = styled.div<{ colors: any }>`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 8px;
  background-color: ${(props) => props.colors.backgroundHue1};
  overflow: auto;
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

export { Panel, ChallengeDashboardItem }
