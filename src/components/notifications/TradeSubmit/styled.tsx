import styled, { css, keyframes } from 'styled-components'
import { isMobileLandscape } from '../../../core/utils'
import close from './close.svg'

const fadeinout = keyframes`
	0% { opacity: 0; }
	10%, 90% { opacity: 1}
	100% { opacity: 0; }
`

const TradeSubmittedModal = styled.div<{
  colors: any
  success: boolean
  isMobile: boolean
}>`
  position: absolute;
  ${(props) => (props.isMobile ? '' : 'margin-top: 10px;')}
  z-index: 9999;
  left: 10px;
  right: 10px;
  ${(props) => (props.isMobile ? 'top: 0;' : '')}

  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 250px;
  min-height: 100px;
  max-height: 180px;
  border-radius: 2px;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props) =>
    props.success ? props.colors.primaryDefault : props.colors.primaryHue1};
  animation: ${fadeinout} 6s linear;

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            min-width: 160px;
          }
        `
      : css``}

  &:after {
    ${(props) => (props.isMobile ? '' : "content: '';")}
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 10px solid transparent;
    border-radius: 3px;
  }

  .closeButton {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 12px;
    height: 12px;
    z-index: 10;
    background: url(${close}) no-repeat center;
    padding: 5px;
    cursor: pointer;
  }

  span {
    display: block;
    padding: 30px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.25;
    text-align: center;
    color: ${(props) => props.colors.secondaryText};
  }
`

const TradeSubmittedPositionClosedModal = styled.div<{
  colors: any
  isMobile: boolean
}>`
  position: absolute;
  ${(props) => (props.isMobile ? '' : 'margin-top: 10px;')}
  z-index: 85;
  left: 10px;
  right: 10px;
  ${(props) => (props.isMobile ? 'top: 0;' : '')}

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 250px;
  min-height: 100px;
  max-height: 180px;
  border-radius: 2px;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props) => props.colors.modalBackground};
  animation: ${fadeinout} 6s linear;
  padding: 30px;

  ${(props) =>
    props.isMobile && isMobileLandscape(props.isMobile)
      ? css`
          @media (orientation: landscape) {
            min-width: 160px;
          }
        `
      : css``}

  &:after {
    ${(props) => (props.isMobile ? '' : "content: '';")}
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 10px solid transparent;
    border-radius: 3px;
  }

  .closeButton {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 12px;
    height: 12px;
    z-index: 10;
    background: url(${close}) no-repeat center;
    padding: 5px;
    cursor: pointer;
  }

  span {
    display: block;
    padding-top: 10px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.25;
    text-align: center;
    color: ${(props) => props.colors.primaryText};
  }

  .icon-success {
    color: white;
  }
`

export { TradeSubmittedModal, TradeSubmittedPositionClosedModal }
