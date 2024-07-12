import styled from 'styled-components'
import { isMobileLandscape } from '../../../core/utils'

const Modal = styled.div<any>`
  position: absolute;
  top: calc(50% - 200px);
  left: ${(props) =>
    props.isMobile && !isMobileLandscape(props.isMobile)
      ? '30px'
      : 'calc(50% - 190px)'};
  width: ${(props) =>
    props.isMobile && !isMobileLandscape(props.isMobile)
      ? 'calc(100vw - 60px)'
      : '550px'};
  height: 300px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
  padding: 20px 40px;
  background-color: ${(props) => props.backgroundColor};

  &:after {
    position: relative;
  }
`

const Caption = styled.span<{ colors: any }>`
  display: block;
  width: 100%;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.colors.secondaryText};
  margin-top: 10px;
`

const SubmitButton = styled.button<any>`
  height: 42px;
  line-height: 42px;
  padding 0 20px;
  border: none;
  outline: none;
  background: none;
  cursor: pointer;

  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.09px;
  text-align: center;

  border-radius: 4px;
  background-color: ${(props) => props.colors.accentDefault};
  color: ${(props) => props.colors.primaryHue3};
`

const PaymentContainer = styled.div<any>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const PaymentContent = styled.div<any>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid;
  font-size: 10px;
  font-weight: 400;
  min-width: 115px;
  background-color: ${(props) => props.colors.backgroundDefault};

  &:first-child {
    margin-right: 10px;
  }

  > span {
    margin-top: 5px;
  }
`

const Buttons = styled.div<any>`
  text-align: center;
`

export {
  Modal,
  SubmitButton,
  Caption,
  Buttons,
  PaymentContainer,
  PaymentContent,
}
