/**
 * Implements a components from mobile header:
 * 3 panels, containers, captions
 */
import styled, { css } from 'styled-components'
import { isMobileLandscape } from '../../../core/utils'
import HamburgerIcon from './icon-hamburger.svg'

const TopPanel = styled.header<{ colors: any; isMobile: boolean }>`
  display: flex;
  width: 100%;
  flex: 0 0 60px;
  box-sizing: border-box;
  background-color: ${(props) => props.colors.backgroundHue1};
  @media (orientation: landscape) {
    background-color: #141f2c !important;
  }
`
const Hamburger = styled.div`
  flex: 0 0 58px;
  background: url(${HamburgerIcon}) no-repeat 20px center;
`

const CompanyLogo = styled.div<{ isMobile: boolean }>`
  flex: 1 1 auto;
  text-align: center;
  a {
    display: block;
    ${(props) =>
      props.isMobile && isMobileLandscape(props.isMobile)
        ? css`
            margin: 10px auto;
            @media (orientation: landscape) {
              margin: 5px auto;
            }
          `
        : css`
            margin: 10px auto;
          `}

    img {
      ${(props) =>
        props.isMobile && isMobileLandscape(props.isMobile)
          ? css`
              height: 40px;
              @media (orientation: landscape) {
                height: 30px;
              }
            `
          : css`
              height: 40px;
            `}
      width: auto;
    }
  }
`
const Switcher = styled.section`
  display: grid;
  grid-template-columns: 28px auto;
  grid-template-rows: auto auto;

  .knobContainer {
    grid-column: 1;
    grid-row: 1 / 3;
    transform: rotate(90deg);
  }
`
const InnerContainer = styled.div`
  display: flex;
  width: 120px;
  height: 12px;
  line-height: 12px;
  margin: 12px auto 0;
`
const KnobCaption = styled.span<any>`
  flex: 1 1 auto;
  height: 18px;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: -0.17px;
  text-transform: uppercase;
  color: ${(props) =>
    props.active ? props.colors.accentDefault : props.colors.secondaryText};
`

const BalancePanel = styled.section<{ colors: any }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 2px solid ${(props) => props.colors.backgroundHue3};
  border-bottom: 2px solid ${(props) => props.colors.backgroundHue3};
  padding: 0 10px 0 0;
  background-color: ${(props) => props.colors.backgroundHue2};
  position: relative;

  .currency-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow-x: auto;
    margin-right: 3px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    pointer-events: none;
    scroll-behavior: smooth;
    padding: 6px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`
const BalanceBlock = styled.div`
  span {
    display: block;
    font-size: 12px;
    letter-spacing: 0.01px;
    color: #8491a3;
  }
  div {
    display: block;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.01px;
    color: #ffffff;
    max-width: 145px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`
const InvestedBlock = styled.div<any>`
  margin-right: 10px;

  span {
    display: block;
    font-size: 12px;
    letter-spacing: 0.01px;
    color: #8491a3;
    white-space: nowrap;
  }

  div {
    display: block;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.01px;
    white-space: nowrap;
    color: ${(props) => props.color || '#75f986'};
  }
`

const HomeButton = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`

const SidebarCounter = styled.div<{ colors: any }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -10px;
  width: 18px;
  height: 18px;
  font-size: 12px;
  padding: 0 2px;
  right: -10px;
  border: 1px solid ${(props) => props.colors.accentDefault};
  border-radius: 50%;
  color: ${(props) => props.colors.accentDefault};
  background-color: ${(props) => props.colors.backgroundHue1};
`

export {
  HomeButton,
  BalanceBlock,
  InvestedBlock,
  BalancePanel,
  KnobCaption,
  InnerContainer,
  Switcher,
  CompanyLogo,
  Hamburger,
  TopPanel,
  SidebarCounter,
}
