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
  height: 360px;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: hidden;
  padding: 20px 40px;
  background-color: ${(props) => props.backgroundColor};
`

const Caption = styled.span<{ colors: any }>`
  display: block;
  width: 100%;
  text-align: center;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.colors.secondaryText};
  margin: 25px 0;
`

const SubCaption = styled.span<{ colors: any }>`
  display: block;
  width: 100%;
  line-height: 20px;
  font-size: 20px;
  color: ${(props) => props.colors.defaultText};
  margin-bottom: 20px;
`

const Content = styled.span<{ colors: any }>`
  display: block;
  width: 100%;
  line-height: 16px;
  font-size: 16px;
  color: ${(props) => props.colors.defaultText};
  margin-bottom: 8px;
`

const SubmitButton = styled.button<any>`
  width: 240px;
  height: 42px;
  line-height: 42px;

  border: none;
  outline: none;
  background: none;
  cursor: pointer;

  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.09px;
  text-align: center;

  border-radius: 4px;
  text-transform: uppercase;
  background-color: ${(props) => props.colors.accentDefault};
  color: ${(props) => props.colors.primaryHue3};
`

const Buttons = styled.div<any>`
  text-align: center;
`

export { Modal, Content, SubmitButton, Caption, SubCaption, Buttons }
