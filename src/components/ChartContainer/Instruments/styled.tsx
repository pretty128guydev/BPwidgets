import styled, { css } from 'styled-components'

const InstrumentsBox = styled.div``

const InstrumentSelector = styled.h1<{ colors: any; isMobile: boolean }>`
  display: inline-flex;
  align-items: center;
  height: ${(props) => (props.isMobile ? '40px' : '50px')};
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  color: ${(props) => props.colors.primaryText};
  cursor: pointer;
  background-color: ${(props) => props.colors.assetsSelector};
  border: 1px solid ${(props) => props.colors.backgroundHue3};
  box-sizing: border-box;
  border-radius: 4px;
  float: left;

  img {
    width: ${(props) => (props.isMobile ? '40px' : '50px')};
    padding: 8px;
    height: 40px;
  }

  span {
    flex: 1 1 auto;
    font-size: ${(props) => (props.isMobile ? '18px' : '24px')};
    max-width: ${(props) => (props.isMobile ? '130px' : '170px')};
    font-weight: 900;
    letter-spacing: -0.18px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  svg {
    margin: ${(props) => (props.isMobile ? '0 6px 0 6px' : '0 13px 0 10px')};
    width: 11px;
  }
`

const InstrumentsGroupBox = styled.div`
  display: flex;
`

const InstrumentGroup = styled.div<{ isOpen?: boolean }>`
  display: flex;
  width: 100%;
  height: 35px;
  line-height: 35px;
  opacity: ${(props) => (props.isOpen ? 1.0 : 0.5)};
  padding-left: 10px;
  white-space: nowrap;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;

  span {
    flex: 1 1 auto;
    margin-left: 10px;
  }
  div {
    flex: 0 0 24px;
    svg {
      vertical-align: middle;
    }
  }

  img {
    width: 24px;
    height: 24px;
  }

  font-size: 14px;

  color: #9fabbd;
  cursor: default;
  background-color: #1e2836;

  &:hover,
  &:active,
  &.active {
    background-color: #0f1721;
  }
`

const InstrumentGroupsBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Panel = styled.div`
  position: absolute;
  z-index: 41;
  top: 50px;
  width: 171px;
  min-height: 180px;
  border-radius: 2px;
  padding-bottom: 6px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);

  background-color: #1e2836;

  .input__group {
    display: flex;
    border-bottom: 1px solid #9fabbd;
    margin-bottom: 6px;

    svg {
      flex: 0 0 40px;
      vertical-align: middle;
      text-align: center;
      margin-top: 5px;
    }
    input {
      flex: 1 1 auto;
      max-width: 130px;

      border: none;
      background: transparent;
      outline: none;
      box-sizing: border-box;

      height: 36px;
      line-height: 36px;

      font-size: 14px;
      letter-spacing: -0.08px;
      color: #9fabbd;
    }
  }
`

const SubGroup = styled.div<any>`
  display: ${(props) => props.display};
  position: absolute;
  ${(props) => (props.top ? `top: ${props.top}px` : '')};
  left: 100%;
  z-index: 43;
  min-width: 171px;
  min-height: 35px;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 2px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: #1e2836;
`

const SubGroupHeader = styled.div<{ scroll: boolean }>`
  display: flex;
  font-family: Roboto;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  text-transform: uppercase;
  height: 32px;
  align-items: center;
  color: #8491a3;

  span:nth-of-type(1) {
    flex: 0 0 73px;
    margin-left: ${(props) => (props.scroll ? '147px' : '157px')};
  }

  span:nth-of-type(2) {
    flex: 0 0 60px;
  }

  span:nth-of-type(3) {
    flex: 0 0 50px;
  }
`

const SubGroupItem = styled.div<{
  active: boolean
  isOpen: boolean
  colors: any
  isMobile: boolean
}>`
  display: flex;
  height: 35px;
  line-height: 35px;
  // opacity: 0.5;
  font-size: 14px;
  letter-spacing: normal;
  cursor: pointer;

  color: #9fabbd;
  opacity: ${(props) => (props.active ? 1 : props.isOpen ? 1.0 : 0.3)};
  background-color: ${(props) => (props.active ? '#0f1721' : 'inherit')};

  img {
    margin: 0 12px 0 10px;
    width: 24px;
    height: 24px;
    align-self: center;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
  }

  span:nth-of-type(1) {
    flex: 0 1 248px;
    padding-right: 15px;
    font-size: 14px;
    ${(props) => (props.isMobile ? 'max-width: 110px' : '')}
  }

  span:nth-of-type(2) {
    padding-right: 15px;
  }

  &:active,
  &:hover,
  &.active {
    background-color: #0f1721;
  }
`

const DailyChangeItem = styled.span<{
  colors: any
  directionUp: boolean
  height: number | undefined
  fontSize: number | undefined
}>`
  color: ${(props) =>
    props.directionUp
      ? props.colors.tradebox.highText
      : props.colors.tradebox.lowText};
  font-weight: 500;
  ${(props) =>
    props.height
      ? css`
          height: ${props.height}px;
        `
      : css``}
  ${(props) =>
    props.fontSize
      ? css`
          font-size: ${props.fontSize}px;
        `
      : css``}
`
const InstrumentPayoutItem = styled.span<{ color: any }>`
  color: ${(props) => props.color};
`

export {
  InstrumentsBox,
  InstrumentSelector,
  InstrumentsGroupBox,
  InstrumentGroup,
  InstrumentGroupsBox,
  Panel,
  SubGroup,
  SubGroupItem,
  SubGroupHeader,
  DailyChangeItem,
  InstrumentPayoutItem,
}