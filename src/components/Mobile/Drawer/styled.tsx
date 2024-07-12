import styled from 'styled-components'
import closeIcon from '../icon-close.svg'
import AvatarFallbackIcon from '../../Header/avatar_fallback.svg'

const Panel = styled.div<any>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.colors.background};
  display: flex;
  flex-direction: column;
  z-index: 24;
`
const TopBar = styled.div<any>`
  .language-container {
    position: relative;
    display: flex;
    align-items: center;
    height: 60px;
    justify-content: flex-end;
    padding: 0 20px;
  }

  .user-container {
    display: flex;
    flex-direction: row;
    padding: 20px;
    justify-content: space-between;
  }

  a {
    position: absolute;
    top: 10px;
    left: 20px;
  }

  border-bottom: solid 1px ${(props) => props.colors.panelBorder};
`

const CloseBtn = styled.div`
  position: absolute;
  top: 25px;
  left: 20px;
  display: block;
  width: 12px;
  height: 12px;
  background: url(${closeIcon}) no-repeat center;
`

const MenuItems = styled.section`
  flex: 1 1 auto;
`

const MenuItem = styled.a<any>`
  display: block;
  height: 20px;
  line-height: 20px;
  font-size: 16px;
  margin-top: 30px;
  padding-left: 20px;
  box-sizing: border-box;
  letter-spacing: -0.27px;
  text-decoration: none;
  user-select: none;

  color: #8491a3;

  img {
    margin-right: 15px;
    vertical-align: sub;
  }
`
const LanguageListWrapper = styled.div<{ colors: any }>`
  z-index: 100;
  position: absolute;
  border-radius: 2px;
  box-shadow: 0 2px 10px 0 rgba(20, 31, 44, 0.8);
  background-color: ${(props) => props.colors.modalBackground};
  color: ${(props) => props.colors.secondaryText};
	top: 60px;
	right: 2px;
  max-height: 450px;
  overflow: auto;

  img {
    width: 24px;
    height: 24px;
  }
}
`

const CurrentLanguage = styled.div<any>`
  display: flex;
  color: ${(props) => props.colors.secondaryText};
  padding-left: 20px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    margin-left: 15px;
  }
`

const AccountPanel = styled.div<any>`
  display: flex;
  margin-right: 20px;

  img,
  .avatar_fallback {
    flex: 0 0 40px;
    display: inline-block;
    vertical-align: middle;
  }

  .avatar_fallback {
    background: url(${AvatarFallbackIcon}) no-repeat center;
    background-size: 40px 40px;
  }

  .user-info-container {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    justify-content: space-between;

    span:first-child {
      color: ${(props) => props.colors.primaryText};
      font-size: 15px;
      font-weight: 500;
    }

    span:last-child {
      font-size: 13px;
      color: ${(props) => props.colors.secondaryText};
    }
  }
`

const ImgAvatar = styled.span<any>`
  position: relative;

  &:before {
    content: '${(props) => props.content}';
    position: absolute;
    top: 3px;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.color};
    font-size: 19px;
    font-weight: bold;
  }
`

export {
  Panel,
  TopBar,
  CloseBtn,
  MenuItems,
  MenuItem,
  CurrentLanguage,
  LanguageListWrapper,
  AccountPanel,
  ImgAvatar,
}
