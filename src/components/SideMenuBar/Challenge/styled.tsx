import styled, { css } from 'styled-components'
import { convertHexToRGBA, isMobileLandscape } from '../../../core/utils'

const Container = styled.div<any>`
  padding: ${(props) => (props.isMobile ? '30px 15px 15px 15px' : '30px')};
  background-color: ${(props) => props.colors.backgroundHue3};
  height: 100%;
  position: relative;
  overflow: auto;

  .header {
    color: ${(props) => props.colors.accentHue1};
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    .header-left,
    .header-right {
      display: flex;
      align-items: center;
    }

    .header-left {
      span {
        margin-left: 10px;
        font-size: 20px;
        font-weight: 600;
      }
    }

    .header-right {
      span {
        margin-left: 4px;
        font-size: 15px;
        font-weight: 600;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;

    .top-section {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      .top-section-item {
        margin-right: 20px;
        padding: 10px 20px;
        font-size: 16px;
        font-weight: 900;
        background-color: ${(props) => props.colors.defaultText};
        color: ${(props) => props.colors.accentHue1};
        border-radius: 5px;
        cursor: pointer;
        min-width: 100px;
        text-align: center;

        &.selected {
          color: ${(props) => props.colors.primaryHue3};
          background-color: ${(props) => props.colors.accentDefault};
          cursor: unset;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    .bottom-section {
      display: flex;
      flex-direction: ${(props) => (props.isMobile ? 'column' : 'row')};
      flex-wrap: wrap;
      ${(props) =>
        (props.isMobile && !isMobileLandscape(props.isMobile)) ||
        props.challengeLength > 2
          ? css``
          : props.challengeLength <= 2
          ? css`
              justify-content: center;
            `
          : css``}

      .section {
        flex: 1;
        margin-right: ${(props) => (props.isMobile ? 0 : '30px')};
        margin-bottom: ${(props) => (props.isMobile ? '15px' : '30px')};
        background-color: ${(props) => props.colors.backgroundHue1};
        padding: 10px;
        ${(props) =>
          props.isMobile && !isMobileLandscape(props.isMobile)
            ? css``
            : css`
                min-width: 350px;
              `};
        max-width: ${(props) => (props.isMobile ? '100%' : '30%')};

        &:last-child {
          margin-right: 0;
        }

        .section-top {
          display: flex;
          justify-content: space-between;
          padding: 15px 15px 20px 15px;

          .section-top-left {
            padding-top: 5px;
            color: ${(props) => props.colors.accentHue1};

            .number {
              font-size: 24px;
              font-weight: 700;
            }

            .text {
              font-size: 15px;
              font-weight: 700;
            }
          }

          .section-top-right {
            color: ${(props) => props.colors.accentDefault};

            .number {
              font-size: 20px;
              font-weight: 600;
              text-align: center;
            }

            .text {
              font-size: 13px;
              font-weight: 400;
            }
          }
        }

        .wrapper {
          background-color: ${(props) =>
            convertHexToRGBA(props.colors.accentDefault, 0.05)};
        }

        .challenge-package-steps {
          display: flex;
          background-color: ${(props) => props.colors.backgroundHue1};

          .challenge-package-step-item {
            flex: 1;
            margin-right: 5px;
            padding: 10px;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            border-bottom: 2px solid transparent;
            text-align: center;
            color: ${(props) => props.colors.defaultText};
            background-color: ${(props) =>
              convertHexToRGBA(props.colors.defaultText, 0.05)};
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;

            &:last-child {
              margin-right: 0;
            }

            &.selected {
              color: ${(props) => props.colors.accentDefault};
              border-bottom-color: ${(props) => props.colors.accentDefault};
              background-color: ${(props) =>
                convertHexToRGBA(props.colors.accentDefault, 0.05)};
              cursor: unset;
            }
          }
        }

        .section-middle {
          padding: 20px 0px;

          .section-middle-item {
            color: ${(props) => props.colors.defaultText};
            font-size: 13px;
            font-weight: 400;
            display: flex;
            justify-content: space-between;
            line-height: 30px;
            padding: 0 10px;

            .text,
            .number {
              display: flex;
              align-items: center;
            }

            .number {
              // color: ${(props) => props.colors.accentDefault};
            }
          }

          .trading-period {
            span {
              margin-left: 5px;
            }

            .number {
              color: ${(props) => props.colors.accentHue1};
            }
          }

          .trading-period {
            margin-top: 30px;

            .number {
              font-size: 15px;
              font-weight: 600;
            }
          }

          .one-time-payment {
            .number {
              color: ${(props) => props.colors.accentDefault};
              font-size: 24px;
              margin-left: 10px;
              margin-bottom: -3px;
            }
          }

          .min-trading-days,
          .max-account-balance,
          .max-daily-loss,
          .profit-target {
            border-bottom: 1px solid
              ${(props) => convertHexToRGBA(props.colors.accentDefault, 0.1)};
          }
        }

        .section-bottom {
          padding: 5px 10px;
        }
      }
    }
  }
`

const StartChallengeButton = styled.button<any>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 46px;
  border: none;
  outline: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 900;
  white-space: nowrap;

  color: ${(props) => props.colors.primaryHue3};
  background-color: ${(props) => props.colors.accentDefault};
`

export { Container, StartChallengeButton }
